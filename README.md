# Step 1 - Build docker image
Run the following command to build the docker image
``` bash
docker build -t kangjing/calculator:v1 -f ./dockerfile .
```

# Step 2 - Create kubernetes deployment configure file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-dep
spec:
  replicas: 3
  selector:
    matchLabels:
      app: calculator
  template:
    metadata:
      labels:
        app: calculator
    spec:
      containers:
      - name: calculator
        image: kangjing/calculator:v1
        ports:
        - containerPort: 3000
```
- "Replicas" specify the number of copied containers for the application
- Under the "containers" field:
    - name refers to the basename of the container, this valve will be used as the part of the constrated container name
    - images refers the docker image
    - containerPort refers to the exposed port of the container, the value should same as the one in the dockerfile EXPOSE value.

# Step 3 - Create the service file
Service.yaml is the key to make the application accessable
``` yaml
apiVersion: v1
kind: Service
metadata:
  name: calculator-ser
spec:
  type: NodePort
  selector:
    app: calculator
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      nodePort: 30881
```
- NodePort: Create a node mapping throuth pods and nodes
- protocol: Which type of network traffic is allowed to access the application
- targetPort: The port that actual connect to the container
- nodePort: The port that bind to the Host (provide external access)

# Step 4 - Apply configurations
``` bash
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml
```