{{/*
Common labels for DRM04 resources
*/}}
{{- define "drm04.labels" -}}
app.kubernetes.io/name: {{ include "drm04.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: drm04
{{- end }}

{{/*
Web service account name
*/}}
{{- define "drm04.web.serviceAccountName" -}}
{{- if .Values.serviceAccounts.web.create -}}
{{ .Values.serviceAccounts.web.name }}
{{- else -}}
{{ include "drm04.fullname" . }}-web
{{- end }}
{{- end }}

{{/*
AI service account name
*/}}
{{- define "drm04.ai.serviceAccountName" -}}
{{- if .Values.serviceAccounts.ai.create -}}
{{ .Values.serviceAccounts.ai.name }}
{{- else -}}
{{ include "drm04.fullname" . }}-ai
{{- end }}
{{- end }}

{{/*
Full name with release prefix
*/}}
{{- define "drm04.fullname" -}}
{{- if .Values.global.fullnameOverride -}}
{{ .Values.global.fullnameOverride }}
{{- else -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end }}
{{- end }}

{{/*
Chart name
*/}}
{{- define "drm04.name" -}}
{{- if .Values.global.nameOverride -}}
{{ .Values.global.nameOverride }}
{{- else -}}
{{ .Chart.Name }}
{{- end }}
{{- end }}