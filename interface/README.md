## Lancer le projet

Premièrement, exécuter le serveur de développement:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

## Plateforme web 

Sur cette plateforme web, vous aurez a disposition la création de compte, la réinitialisation de mot de passe et le panel adminatateur pour les comptes administrateur.

Pour cela il faut lier la plateform web à un projet supabase. Pour cela il faudra modifier les valeurs NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.

## Supabase

Supabase doit contenir une table **server_configurations** en la créant ainsi :
```CREATE TABLE server_configurations (
  id INT PRIMARY KEY,
  baseURLServer TEXT,
  serverPort TEXT,
  cameraPort TEXT,
  baseURLCamera TEXT
);
```
et ainsi créer une row qui servira pour la communication entre le server web et l'API du server :
```
INSERT INTO server_configurations (id, baseURLServer, serverPort, cameraPort, baseURLCamera) 
VALUES (1, 'http://exemple-server.com', '8080', '9090', 'http://exemple-camera.com');
```


Supabase doit contenur une table **user_profiles** en la créant ainsi : 
```
CREATE TABLE user_profiles (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nom TEXT,
  prénom TEXT,
  promotion TEXT,
  is_admin BOOLEAN,
  validated BOOLEAN
);
```
