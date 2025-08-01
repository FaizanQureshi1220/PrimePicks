# PrimePicks Kubernetes Setup

## Prerequisites
- Docker
- Kubernetes (minikube, Docker Desktop, or kind)
- kubectl
- NGINX Ingress Controller (see below)

## 1. Build Docker Images

From project root:

```
# Build backend image
cd Server
docker build -t primepicks-server:latest .

# Build frontend image
cd ../Client
# For Vite dev server (not for production):
docker build -t primepicks-client:latest .
```

## 2. Start Kubernetes Cluster

If using minikube:
```
minikube start
minikube addons enable ingress
```

## 3. Apply Kubernetes Manifests

```
kubectl apply -f K8S/
```

## 4. Add Host Entry

Edit your hosts file (`/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`) and add:
```
127.0.0.1 primepicks.local
```

## 5. Access the Site

Open [http://primepicks.local](http://primepicks.local) in your browser.

---

## Notes
- DB credentials are for local/dev only. Change secrets for production.
- If you use a different DB, update the manifests accordingly.
- For production, use a proper static build for the frontend (not Vite dev server). 