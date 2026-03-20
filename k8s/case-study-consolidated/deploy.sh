#!/bin/bash
# Deploy case-study-consolidated (includes custom network via Multus)
set -e

echo "=== 1. Installing Multus CNI (required for custom network) ==="
kubectl apply -f https://raw.githubusercontent.com/k8snetworkplumbingwg/multus-cni/master/deployments/multus-daemonset-thick.yml

echo "=== 2. Waiting for Multus to be ready ==="
kubectl -n kube-system rollout status daemonset/multus --timeout=120s || true

echo "=== 3. Deploying case-study-consolidated ==="
kubectl apply -k .

echo "=== 4. Waiting for rollouts ==="
kubectl -n case-study-consolidated rollout status statefulset/db-primary --timeout=300s
kubectl -n case-study-consolidated rollout status statefulset/db-replica --timeout=300s
kubectl -n case-study-consolidated rollout status deployment/backend --timeout=300s
kubectl -n case-study-consolidated rollout status deployment/frontend --timeout=300s

echo "=== Done ==="
kubectl -n case-study-consolidated get pods,svc -o wide
echo ""
echo "App: http://<your-ip>:30080"
echo "Grafana: http://<your-ip>:30300 (admin/admin)"
echo "Prometheus: http://<your-ip>:30090"
