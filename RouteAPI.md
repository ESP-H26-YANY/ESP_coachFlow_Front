# Documentation API CoachFlow

## 🔐 Auth (Public)

### Inscription
- **Route :** `POST /api/Auth/register`
- **Body :** ```json
  {
    "name": "string (max 20)",
    "email": "string",
    "password": "string (min 6)",
    "role": "user | coach"
  }
  ```

### Connexion
- **Route :** `POST /api/Auth/login`
- **Body :**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

---

## 👤 User (JWT Requis)

### Mon Profil
- **Route :** `GET /api/User/me`
- **Rôles :** `user`, `coach`

### Recharger le Wallet
- **Route :** `POST /api/User/topup`
- **Rôles :** `user`, `coach`
- **Body :** 
```json
  {
    "amount": 50
  }
  ```

---

##  Guide (JWT Requis)

### Consulter les guides
- **Tous :** `GET /api/Guide`
- **Détails :** `GET /api/Guide/{id}`
- **Par coach :** `GET /api/Guide/user/{userId}`
- **Rôles :** `user`, `coach`

### Télécharger un guide (Acheté ou Propriétaire)
- **Route :** `GET /api/Guide/{id}/download`
- **Rôles :** `user`, `coach`
- **Retour :** Fichier `application/pdf`

### Gestion des guides (Coach uniquement)
- **Création :** `POST /api/Guide`
  - **Type :** `multipart/form-data`
  - **Champs :** `pdfFile` (Fichier), `title` (str), `description` (str), `category` (str), `price` (int)

- **Modification :** `PUT /api/Guide/{id}`
  - **Body :**
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string",
      "price": 10
    }
    ```

- **Suppression :** `DELETE /api/Guide/{id}`

---

##  Library (JWT Requis, Rôle: user)

### Favoris (Sans accès PDF)
- **Lister :** `GET /api/Library`
- **Ajouter :** `POST /api/Library/{guideId}`
- **Retirer :** `DELETE /api/Library/{guideId}`

### Achats (Avec accès PDF)
- **Lister :** `GET /api/Library/purchased`
- **Acheter (via Wallet) :** `POST /api/Library/purchase/{guideId}`

## Statistique ** Coach **
** Route : User/dashboard-stats **

```json
{
  "financials": {
    "currentWalletBalance": 585,
    "totalLifetimeEarnings": 185,
    "revenueLast30Days": 185
  },
  "sales": {
    "totalActiveGuides": 4,
    "totalGuidesSold": 4,
    "salesLast30Days": 4,
    "totalUniqueCustomers": 1
  },
  "engagement": {
    "totalWishlisted": 1,
    "mostWishlistedGuideId": "a134650d-7433-43db-867f-ba6fb17730aa",
    "mostWishlistedGuide": "string",
    "conversionRatePercentage": 400
  },
  "topBestSellers": [
    {
      "id": "2ac057ac-6d71-4ddf-9e2f-6d30e0295d99",
      "title": "wdwd",
      "sales": 1
    },
    {
      "id": "bd793877-932e-4285-9dbb-fede855e6e2a",
      "title": "testt",
      "sales": 1
    },
    {
      "id": "097a9e49-636c-4e5f-b277-37bb4e348e85",
      "title": "string",
      "sales": 1
    }
  ]
}