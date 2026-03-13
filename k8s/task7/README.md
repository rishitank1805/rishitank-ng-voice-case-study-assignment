# Q7 - Strict Node-Specific DB Pod Placement

Goal: allow deployment engineers to schedule specific DB cluster pods on specific nodes with strict enforcement.

This implementation uses:
- node labels (`db-role=primary|replica`)
- `requiredDuringSchedulingIgnoredDuringExecution` node affinity on DB StatefulSets

## 1) Recreate local cluster with multiple worker nodes

```bash
kind delete cluster --name case-study || true
kind create cluster --name case-study --config k8s/q7/kind-multinode.yaml
kubectl config use-context kind-case-study
kubectl get nodes -o wide
```

## 2) Label workers for DB role placement

See `k8s/q7/node-labels.md`.

Example:

```bash
kubectl label node case-study-worker db-role=primary --overwrite
kubectl label node case-study-worker2 db-role=replica --overwrite
kubectl get nodes --show-labels | grep db-role
```

## 3) Build and load local images (required after cluster recreation)

```bash
docker build -t local/case-backend:v1 ./app/backend
docker build -t local/case-frontend:v1 ./app/frontend
kind load docker-image local/case-backend:v1 --name case-study
kind load docker-image local/case-frontend:v1 --name case-study
```

## 4) Deploy stack with strict DB affinity

```bash
kubectl apply -f k8s/deployment.yaml
kubectl -n case-study rollout status statefulset/db-primary --timeout=240s
kubectl -n case-study rollout status statefulset/db-replica --timeout=240s
kubectl -n case-study get pods -o wide
```

Expected:
- `db-primary-0` runs on node labeled `db-role=primary`
- `db-replica-0` runs on node labeled `db-role=replica`

## 5) Strict-mode proof (failure behavior)

Remove the replica label and restart replica pod:

```bash
kubectl label node case-study-worker2 db-role-
kubectl -n case-study delete pod db-replica-0
kubectl -n case-study get pods -w
```

Expected:
- `db-replica-0` remains `Pending`
- `kubectl -n case-study describe pod db-replica-0` shows node affinity mismatch

Restore the label:

```bash
kubectl label node case-study-worker2 db-role=replica --overwrite
kubectl -n case-study rollout status statefulset/db-replica --timeout=240s
```

## 6) Validation commands

```bash
kubectl get nodes --show-labels
kubectl -n case-study get pods -o wide
kubectl -n case-study describe pod db-primary-0
kubectl -n case-study describe pod db-replica-0
```
