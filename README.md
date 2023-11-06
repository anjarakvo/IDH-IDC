# IDH-IDC

Income Drive Calculator

## Dev Setup

```bash
docker volume create idc-docker-sync
./dc.sh up -d
```

Now you will be able to access [http://localhost:3000](http://localhost:3000)

## Seed User

```bash
docker compose exec backend python -m seeder.user
```

Password for the new user added via CLI is: `password`
