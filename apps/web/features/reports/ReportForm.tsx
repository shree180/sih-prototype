"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DISASTER_TYPES, ASSET_TYPES } from "@/lib/rbac";
import { LocationPicker, PickedLocation } from "@/features/map/LocationPicker";
import { submitReport } from "./actions";
import { compressImages, generateFilePreview, formatFileSize, CompressedImage } from "@/lib/image/client-compress";

const MAX_IMAGES = 5;
const MAX_MB = 10;

interface UploadedFile {
  file: File;
  compressed: CompressedImage;
  preview: string;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadProgress: number;
  uploadError?: string;
  serverData?: {
    originalUrl: string;
    thumbnailUrl: string;
    redactedUrl: string;
    sha256: string;
    perceptualHash: string;
    width: number;
    height: number;
    fileSize: number;
  };
}

export function ReportForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loc, setLoc] = useState<PickedLocation | null>(null);
  const [disaster, setDisaster] = useState(DISASTER_TYPES[0]);
  const [asset, setAsset] = useState(ASSET_TYPES[0]);
  const [description, setDescription] = useState("");
  const [observed, setObserved] = useState("");
  const [affected, setAffected] = useState("");
  const [infra, setInfra] = useState(false);
  const [access, setAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportId] = useState(() => crypto.randomUUID());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const canProceedFromStep1 = uploadedFiles.length > 0 && uploadedFiles.every((f) => f.uploadStatus === "completed");

  function validateFile(file: File): string | null {
    if (file.size > MAX_MB * 1024 * 1024) return `File "${file.name}" exceeds ${MAX_MB}MB limit`;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return `File "${file.name}" must be JPEG, PNG, or WebP`;
    return null;
  }

  async function processAndUploadFiles(files: File[]) {
    const validFiles = files.filter((f) => {
      const err = validateFile(f);
      if (err) { setError(err); return false; }
      return true;
    });
    if (validFiles.length === 0) return;
    setError(null);

    const previews: string[] = await Promise.all(validFiles.map(generateFilePreview));
    const newUploadedFiles: UploadedFile[] = validFiles.map((file, i) => ({
      file, compressed: { file, dataUrl: previews[i], width: 0, height: 0, originalSize: file.size, compressedSize: file.size },
      preview: previews[i], uploadStatus: "pending", uploadProgress: 0,
    }));
    setUploadedFiles((prev) => [...prev, ...newUploadedFiles].slice(0, MAX_IMAGES));

    const compressed = await compressImages(validFiles, { maxWidth: 2048, maxHeight: 2048, quality: 0.85 });
    setUploadedFiles((prev) => prev.map((uf) => {
      const compIdx = validFiles.findIndex((vf) => vf === uf.file);
      return compIdx >= 0 ? { ...uf, compressed: compressed[compIdx], uploadStatus: "uploading" as const } : uf;
    }));

    abortControllerRef.current = new AbortController();
    try {
      await uploadFiles(compressed, abortControllerRef.current.signal);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") setError(err.message);
    }
  }

  async function uploadFiles(compressedImages: CompressedImage[], signal: AbortSignal) {
    const formData = new FormData();
    compressedImages.forEach((c) => formData.append("images", c.file));
    formData.append("reportId", reportId);

    const response = await fetch("/api/upload", { method: "POST", body: formData, signal });
    if (!response.ok) {
      let errMsg = "Upload failed";
      try { const err = await response.json(); errMsg = err.error || errMsg; } catch {}
      throw new Error(errMsg);
    }
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || "Upload failed");

    setUploadedFiles((prev) => prev.map((uf, idx) => {
      const serverFile = data.files[idx];
      return serverFile ? { ...uf, uploadStatus: "completed" as const, uploadProgress: 100, serverData: serverFile } : uf;
    }));
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) processAndUploadFiles(files);
    if (e.target) e.target.value = "";
  }

  function handleDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation(); }
  function handleDrop(e: DragEvent) {
    e.preventDefault(); e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processAndUploadFiles(files);
  }

  function removeFile(index: number) { setUploadedFiles((prev) => prev.filter((_, i) => i !== index)); }

  async function onFinalSubmit() {
    if (uploadedFiles.length === 0) return setError("Please upload at least one photograph.");
    if (!canProceedFromStep1) return setError("Please wait for uploads to complete.");
    if (!loc) return setError("Please confirm the incident location.");

    setSubmitting(true); setError(null);
    setSubmissionPhase("Protecting privacy, assessing evidence...");

    const fd = new FormData();
    uploadedFiles.forEach((uf) => {
      if (uf.serverData) fd.append("imageUrls", JSON.stringify(uf.serverData));
    });
    fd.append("disaster_type", disaster);
    fd.append("asset_type", asset);
    fd.append("description", description);
    if (observed) fd.append("observed_severity", observed);
    fd.append("lat", String(loc.lat));
    fd.append("lng", String(loc.lng));
    if (loc.accuracy) fd.append("accuracy", String(loc.accuracy));
    fd.append("location_source", loc.source);
    if (affected) fd.append("affected_people", affected);
    if (infra) fd.append("infrastructure_impact", "on");
    if (access) fd.append("accessibility_blocked", "on");

    let res: Awaited<ReturnType<typeof submitReport>>;
    try { res = await submitReport(fd); } catch {
      setSubmitting(false); setSubmissionPhase(null);
      setError("Could not submit report. Please try again."); return;
    }
    setSubmitting(false);

    if (!res) { setSubmissionPhase(null); setError("Unexpected error. Please try again."); return; }
    if (!res.ok) { setSubmissionPhase(null); return setError(res.error ?? "Submission failed."); }

    setSubmissionPhase(null);
    setTriageResult({ reportId: res.reportId, disaster, ...res.assessment, confidence: `${Math.round((res.assessment?.confidence ?? 0) * 100)}%` });
  }

  const stepsList = [
    { num: 1, label: "Photos" },
    { num: 2, label: "Location" },
    { num: 3, label: "Details" },
    { num: 4, label: "Privacy" },
    { num: 5, label: "Submit" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Stepper */}
      <div className="rounded-2xl glass-light border border-white/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-navy-900">Report Damage</h1>
            <p className="text-[11px] text-navy-400">Citizen Damage Submission</p>
          </div>
          <Badge variant="warning">Step {step}/5</Badge>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          {stepsList.map((s) => (
            <div key={s.num} className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${s.num <= step ? "bg-amber-500" : "bg-navy-100"}`} />
              <span className={`mt-1 block text-[10px] font-medium truncate ${s.num === step ? "text-amber-600" : "text-navy-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700 animate-fade-in-scale">
          <span className="text-red-500">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PHOTOS */}
      {step === 1 && (
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h2 className="text-sm font-bold text-navy-900">Upload Damage Photos</h2>
          <p className="text-[11px] text-navy-400 mt-1">Clear photos help AI triage. Max 5 images, 10MB each.</p>

          <div
            className="mt-4 border-2 border-dashed border-navy-200 rounded-2xl p-8 text-center transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/20 bg-navy-50/30"
            onDragOver={handleDragOver} onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple capture="environment" onChange={handleFileSelect} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-xl mb-3">📸</div>
              <p className="text-sm font-medium text-navy-700">Click or drag photos here</p>
              <p className="text-[11px] text-navy-400 mt-1">JPEG, PNG, WebP · Camera capture supported</p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Photos ({uploadedFiles.length}/{MAX_IMAGES})
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {uploadedFiles.every((f) => f.uploadStatus === "completed") ? "✓ All ready" : "Processing..."}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {uploadedFiles.map((uf, idx) => (
                  <div key={idx} className="group relative rounded-xl border border-navy-100/60 overflow-hidden bg-navy-50">
                    <img src={uf.preview} alt="Upload" className="aspect-video w-full object-cover" />
                    <button type="button" onClick={() => removeFile(idx)}
                      className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900/80 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-500 text-xs">
                      ×
                    </button>
                    <div className="p-1.5 text-[10px] bg-white">
                      <p className="truncate font-medium text-navy-700">{uf.file.name}</p>
                      <p className="text-navy-400">{formatFileSize(uf.file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canProceedFromStep1}>Continue →</Button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {step === 2 && (
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h2 className="text-sm font-bold text-navy-900">Incident Location</h2>
          <p className="text-[11px] text-navy-400 mt-1">Confirm where damage occurred. Use GPS or drag the pin.</p>
          <div className="mt-4"><LocationPicker value={loc} onChange={setLoc} /></div>
          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
            <Button onClick={() => setStep(3)} disabled={!loc}>Continue →</Button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {step === 3 && (
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h2 className="text-sm font-bold text-navy-900">Incident Details</h2>
          <p className="text-[11px] text-navy-400 mt-1">Provide context to help responders prioritize.</p>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="disaster" className="mb-1.5 block">Disaster Type</Label>
                <Select id="disaster" value={disaster} onChange={(e) => setDisaster(e.target.value)}>
                  {DISASTER_TYPES.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1).replace("_", " ")}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="asset" className="mb-1.5 block">Asset Type</Label>
                <Select id="asset" value={asset} onChange={(e) => setAsset(e.target.value)}>
                  {ASSET_TYPES.map((a) => (
                    <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1).replace("_", " ")}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="desc" className="mb-1.5 block">What did you observe?</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                placeholder="e.g. Ground floor water level rising, crack on south pillar, power lines down..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="observed_sev" className="mb-1.5 block">Your Severity (Optional)</Label>
                <Select id="observed_sev" value={observed} onChange={(e) => setObserved(e.target.value)}>
                  <option value="">Let AI estimate</option>
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="people" className="mb-1.5 block">Affected People</Label>
                <Input id="people" type="number" min={0} value={affected} onChange={(e) => setAffected(e.target.value)} placeholder="e.g. 10" />
              </div>
            </div>

            <div className="rounded-xl bg-navy-50/50 border border-navy-100/60 p-3.5 space-y-2.5">
              <label className="flex items-center gap-2.5 text-xs font-medium text-navy-700 cursor-pointer">
                <input type="checkbox" checked={infra} onChange={(e) => setInfra(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-300 text-amber-500 focus:ring-amber-500" />
                <span>Critical Infrastructure Impact</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-medium text-navy-700 cursor-pointer">
                <input type="checkbox" checked={access} onChange={(e) => setAccess(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-300 text-amber-500 focus:ring-amber-500" />
                <span>Road / Accessibility Blocked</span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={() => setStep(4)}>Privacy Check →</Button>
          </div>
        </div>
      )}

      {/* STEP 4: PRIVACY */}
      {step === 4 && (
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy-900">Privacy Protection</h2>
            <Badge variant="success">Privacy-by-Design</Badge>
          </div>
          <p className="text-[11px] text-navy-400 mt-1">Faces are redacted before responders view images.</p>

          <div className="mt-4 rounded-2xl bg-navy-950 text-white p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-300">Original evidence · restricted</span>
              <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] text-navy-300">Redacted on submission</span>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 flex items-center justify-center">
                <img src={uploadedFiles[0].preview} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-[11px] text-navy-400 pt-2 border-t border-white/10">
              <div>
                <p className="font-semibold text-navy-200">Encrypted storage</p>
                <p>Originals accessible only under auditable warrant.</p>
              </div>
              <div>
                <p className="font-semibold text-navy-200">Redacted derivative</p>
                <p>Responders see privacy-masked imagery only.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
            <Button onClick={() => setStep(5)}>Review & Submit →</Button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMIT */}
      {step === 5 && (
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h2 className="text-sm font-bold text-navy-900">Review & Submit</h2>
          <p className="text-[11px] text-navy-400 mt-1">Verify your information before submitting.</p>

          <div className="mt-4 divide-y divide-navy-100/60 rounded-xl border border-navy-100/60 bg-navy-50/30 p-3.5 text-xs">
            {[
              ["Disaster", disaster.replace("_", " ")],
              ["Asset", asset],
              ["Location", loc ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}` : "—"],
              ["Photos", `${uploadedFiles.length} attached`],
              ["Description", description || "None"],
            ].map(([label, value]) => (
              <div key={label} className="py-2 flex justify-between">
                <span className="text-navy-400 font-medium">{label}</span>
                <span className="font-semibold text-navy-900 capitalize truncate max-w-[200px] text-right">{value}</span>
              </div>
            ))}
          </div>

          {submissionPhase && (
            <div className="mt-4 rounded-xl glass-tinted p-4 text-center space-y-2 animate-fade-in-scale">
              <div className="flex items-center justify-center gap-2 text-amber-700 font-semibold text-xs">
                <div className="h-4 w-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <span>{submissionPhase}</span>
              </div>
              <p className="text-[11px] text-amber-600">AI triage analyzing damage indicators...</p>
            </div>
          )}

          {triageResult && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs space-y-2 animate-fade-in-scale">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 text-sm">Report Submitted</span>
                <Badge variant="success">Assessment ready</Badge>
              </div>
              <p className="text-emerald-700">
                Severity: <strong className="capitalize">{triageResult.severity}</strong> · Confidence: {triageResult.confidence}
              </p>
              <p className="text-emerald-600 text-[11px]">Preliminary — requires authority review.</p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            {triageResult ? (
              <Button onClick={() => router.push(`/citizen/my-reports?submitted=${triageResult.reportId}`)}>View Reports</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setStep(4)} disabled={submitting}>← Back</Button>
                <Button onClick={onFinalSubmit} disabled={submitting} loading={submitting}>
                  Submit Report
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
