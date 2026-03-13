# Q7 Node Labeling (Strict Placement)

After creating the multi-node kind cluster, list nodes:

```bash
kubectl get nodes -o wide
```

Choose two worker nodes and label them for DB role placement.
Example (replace node names from your output):

```bash
kubectl label node case-study-worker db-role=primary --overwrite
kubectl label node case-study-worker2 db-role=replica --overwrite
```

Validate labels:

```bash
kubectl get nodes --show-labels | grep db-role
```

Optional rollback labels:

```bash
kubectl label node case-study-worker db-role-
kubectl label node case-study-worker2 db-role-
```
