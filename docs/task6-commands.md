# Task6 Terminal Commands (Corrected)

Use these commands to demonstrate Task6. The resource type is **`network-attachment-definitions`** (with hyphens) or short form **`net-attach-def`**.

## 1. List all task6 resources

```bash
kubectl get all,network-attachment-definitions -n case-study-q6
```

Or using the short name:

```bash
kubectl get all,net-attach-def -n case-study-q6
```

## 2. Inspect the NetworkAttachmentDefinition

```bash
kubectl get network-attachment-definitions -n case-study-q6 q6-secondary-net -o yaml
```

## 3. Show pod interfaces (eth0 + net1)

```bash
kubectl exec -n case-study-q6 q6-pod-a -- ip addr
```

## 4. Get IPs per interface

```bash
# Cluster network (eth0)
kubectl exec -n case-study-q6 q6-pod-a -- ip -4 addr show eth0
kubectl exec -n case-study-q6 q6-pod-b -- ip -4 addr show eth0

# Secondary network (net1)
kubectl exec -n case-study-q6 q6-pod-a -- ip -4 addr show net1
kubectl exec -n case-study-q6 q6-pod-b -- ip -4 addr show net1
```

## 5. Ping via cluster network (eth0)

```bash
POD_B_ETH0=$(kubectl exec -n case-study-q6 q6-pod-b -- ip -4 addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1)
kubectl exec -n case-study-q6 q6-pod-a -- ping -c 2 $POD_B_ETH0
```

## 6. Multus daemon

```bash
kubectl get pods -n kube-system -l app=multus
```

---

**Note:** Use `network-attachment-definitions` or `net-attach-def`, not `networkattachmentdefinition`.
