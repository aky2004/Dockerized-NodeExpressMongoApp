# 🐳 Dockered Node.js and Mango DB Application

> A production-ready REST API with Node.js, Express, and MongoDB – fully containerized and ready to ship.

A modern Docker + Compose setup demonstrating containerized Node.js applications with MongoDB integration. Perfect for learning DevOps fundamentals or as a starter template for microservice architectures.

## 🚀 Quick Stack

| Component | Tech | Port |
|-----------|------|------|
| API Server | Node.js + Express | `3000` |
| Database | MongoDB | `27017` |
| Database UI | Mongo Express | `8081` |
| Orchestration | Docker Compose | — |

---

## 🏗️ Architecture

```
           ┌─────────────────────────────────────────────┐
           │        Docker Network (docker-compose)      │
           ├─────────────────────────────────────────────┤
           │                                             │
           │  ┌──────────────┐     ┌──────────────────┐  │
           │  │  Node.js     │────▶│   MongoDB        │  │
           │  │  Express     │     │   akyMongo       │  │
           │  │  :3000       │     │   :27017         │  │
           │  └──────────────┘     └──────────────────┘  │
           │                              ▲              │
           │                              │              │
           │       ┌──────────────────────┘              │
           │       │                                     │
           │  ┌────▼──────────────┐                      │
           │  │  Mongo Express    │                      │
           │  │  :8081            │                      │
           │  └───────────────────┘                      │
           │                                             │
           └─────────────────────────────────────────────┘

```

### 📦 Services Breakdown

**MongoDB Service** (`akyMongo`)
- Official MongoDB image with authentication
- Credentials: `root` / `password`
- Internal network access via `akyMongo:27017`

**Mongo Express Service** (`akyMongoExpress`)
- Web UI for MongoDB management
- Access at `http://localhost:8081`
- Useful for debugging and data inspection

**Node.js Application** (via Dockerfile)
- Express REST API
- Connects to MongoDB for user data
- Runs on `http://localhost:3000`

---

## 🔧 How It Works

### Dockerfile Walkthrough

```dockerfile
FROM node
```
👉 Start with the official Node.js image

```dockerfile
ENV MONGO_DB_USERNAME=root \
    MONGO_DB_PASSWORD=password
```
👉 Set MongoDB credentials as environment variables (used in server.js)

```dockerfile
RUN mkdir -p testNodeApp
COPY . /testNodeApp
```
👉 Create app directory and copy all files into the container

```dockerfile
CMD ["node","/testNodeApp/server.js"]
```
👉 Run this command when the container starts

### Docker Compose (mongo.yaml) Walkthrough

```yaml
mongo:
  image: mongo
  container_name: akyMongo
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: password
```
👉 MongoDB spins up with authentication enabled

```yaml
mongo-express:
  image: mongo-express
  container_name: akyMongoExpress
  environment:
    ME_CONFIG_MONGODB_URL: mongodb://root:password@akyMongo:27017/
```
👉 Mongo Express auto-connects to MongoDB via the `akyMongo` service name

**How they talk to each other:**
- Services use internal Docker DNS: `akyMongo:27017`
- No need for localhost – Docker's network handles it
- Credentials match across both services

---

## 📋 Prerequisites

- **Docker Desktop** – [Download](https://www.docker.com/products/docker-desktop)
- **Git** – for cloning
- **~5 mins** – to get running

---

## ⚡ Quick Start

```bash
# 1️⃣ Clone the repo
git clone https://github.com/YOUR_USERNAME/dockered-node-mango.git
cd dockered-node-mango

# 2️⃣ Start MongoDB + Mongo Express
docker-compose -f mongo.yaml up -d

# 3️⃣ Build the Node.js app
docker build -t dockered-node-mango .

# 4️⃣ Run it
docker run -d --name node-app -p 3000:3000 dockered-node-mango
```

**That's it!** Your stack is ready. Open:
- 🌐 API: http://localhost:3000
- 💾 MongoDB UI: http://localhost:8081

---

## 🔗 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Node.js API** | `http://localhost:3000` | No auth |
| **Mongo Express** | `http://localhost:8081` | `root` / `password` |
| **MongoDB Direct** | `localhost:27017` | `root` / `password` |

---

## 📡 API Endpoints

### Get All Users
```http
GET http://localhost:3000/api/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "507f1f77bcf86cd799439011", "name": "John Doe" },
    { "_id": "507f1f77bcf86cd799439012", "name": "Jane Smith" }
  ],
  "count": 2
}
```

### Get User by ID
```http
GET http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

**Try it:**
```bash
# Get all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

---

## 💻 Development Workflow

### Local Development (No Docker)
```bash
npm install
npm run dev     # Runs with nodemon (auto-reload)
```

### Docker Development
```bash
# One-liner to build and run
docker build -t dockered-node-mango . && docker run -p 3000:3000 dockered-node-mango

# Or separately
docker build -t dockered-node-mango .
docker run -p 3000:3000 dockered-node-mango
```

### View Logs
```bash
# All containers
docker-compose -f mongo.yaml logs -f

# Specific container
docker logs node-app -f
```

### Stop Everything
```bash
# Stop and remove containers
docker-compose -f mongo.yaml down

# Also remove volumes
docker-compose -f mongo.yaml down -v
```

### Useful Commands
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Inspect a container
docker inspect akyMongo

# Access MongoDB shell
docker exec -it akyMongo mongosh -u root -p password

# View image layers
docker history dockered-node-mango
```

---

## 🔐 Configuration

### Environment Variables

| Var | Value | Used By |
|-----|-------|---------|
| `PORT` | `3000` | Node.js Server |
| `MONGO_DB_USERNAME` | `root` | Dockerfile / server.js |
| `MONGO_DB_PASSWORD` | `password` | Dockerfile / server.js |
| `MONGO_INITDB_ROOT_USERNAME` | `root` | MongoDB Init |
| `MONGO_INITDB_ROOT_PASSWORD` | `password` | MongoDB Init |

**Customize these in `mongo.yaml` and `Dockerfile` before deployment!**

---

## 📂 Project Structure

```
dockered-node-mango/
├── Dockerfile              # 🐳 Container blueprint
├── mongo.yaml             # 🎼 Docker Compose orchestration
├── server.js              # 🚀 Express app entry point
├── package.json           # 📦 Dependencies
├── .gitignore            # 🚫 Git ignore rules
└── README.md             # 📖 This file
```

**Key Files:**
- `Dockerfile` – Defines how Node.js app is containerized
- `mongo.yaml` – Spins up MongoDB and Mongo Express together
- `server.js` – REST API with MongoDB queries
- `package.json` – `express` + `mongodb` driver

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
docker ps | grep akyMongo

# If not running, restart it
docker-compose -f mongo.yaml restart mongo
```

### ❌ "Port 3000/27017 already in use"
```bash
# Find what's using the port
lsof -i :3000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
docker run -p 3001:3000 dockered-node-mango
```

### ❌ "Application container won't start"
```bash
# Check container logs
docker logs node-app

# Rebuild without cache
docker build --no-cache -t dockered-node-mango .

# Check Dockerfile syntax
docker build --progress=plain -t dockered-node-mango .
```

### ❌ "Mongo Express won't connect"
```bash
# Verify service name and credentials in mongo.yaml
# Make sure MONGO_URL uses: mongodb://root:password@akyMongo:27017/

# Restart Mongo Express
docker-compose -f mongo.yaml restart mongo-express
```

### ✅ Verify Everything Works
```bash
# See all containers
docker ps

# Check container networking
docker network ls

# Inspect logs
docker-compose -f mongo.yaml logs --tail 20

# Test API
curl -s http://localhost:3000/api/users | jq
```

---

## 🎓 What You'll Learn

- ✅ **Docker Basics** – Creating and running containers
- ✅ **Multi-Container Apps** – Orchestrating services with Compose
- ✅ **Networking** – How containers communicate
- ✅ **Data Persistence** – MongoDB with Docker volumes
- ✅ **Environment Management** – Configuration across containers
- ✅ **REST APIs** – Building with Express.js
- ✅ **Database Integration** – MongoDB connection pooling
- ✅ **DevOps Workflow** – Build, run, debug, deploy

---

## 🚀 Next Steps

- [ ] Add JWT authentication
- [ ] Create unified `docker-compose.yml` with Node service
- [ ] Set up `.env` file for secret management
- [ ] Add health checks in docker-compose
- [ ] Implement CI/CD with GitHub Actions
- [ ] Add request logging middleware
- [ ] Set up MongoDB data persistence with volumes
- [ ] Deploy to Docker Hub or AWS

---

## 📝 License

MIT – Feel free to use, modify, and learn from this project!

---

## 👤 Author

Created during my Docker & DevOps learning journey. Questions? Open an issue!

### Health check
```
GET /health
```
Check if the server is running.

## Example Responses

**GET /api/users**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "count": 1
}
```

**GET /api/users/:id**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
