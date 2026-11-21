# ERD Draft — GreenBasket

Author: Zeeshan Razzaq
Date: 2026-11-21
Status: Draft before Chapter 5 implementation

## Diagram

```mermaid
erDiagram
    USER ||--o| PROFILE : has
    USER ||--o| STORE : owns
    STORE ||--o{ PRODUCT : sells
    USER ||--o{ CARTITEM : has
    PRODUCT ||--o{ CARTITEM : references
    USER ||--o{ ORDER : customer_places
    STORE ||--o{ ORDER : vendor_receives
    ORDER ||--|{ ORDERITEM : embeds
```

Each ORDER document contains an embedded array `orderItems` with `nameAtPurchase`, `priceAtPurchase`, `unitAtPurchase`, `quantity`, `productId`.

## Collection inventory

| Collection | Purpose         | Key fields                                             |
| ---------- | --------------- | ------------------------------------------------------ |
| users      | login identity  | email, passwordHash, role                              |
| profiles   | display info    | userId ref, displayName                                |
| stores     | vendor shop     | userId ref, name, address                              |
| products   | listings        | storeId ref, name, price, unit, stockQty, isPerishable |
| cartitems  | shopping cart   | userId, productId, storeId, quantity                   |
| orders     | checkout result | customerId, storeId, status, orderItems[] embedded     |

## Embed vs reference audit

**User → Profile (reference).** Profiles live in their own collection and point to the user through `userId`. Login data (email, passwordHash, role) is sensitive and read on every auth check, while display data is read only when showing a profile. Keeping them separate means auth queries never load extra fields.

**User → Store (reference).** A vendor owns one store, linked by `userId`. The store has its own lifecycle (products, incoming orders) and is queried independently of the user, so embedding it inside the user document would bloat it and tie two unrelated concerns together.

**Store → Products (reference).** A store can list many products, and each product's price and stock change often. Embedding products in the store would create a large, unbounded array that is rewritten on every stock update. Products are also searched and listed across stores, which needs their own collection.

**CartItem → User, Product, Store (reference).** A cart item stores `userId`, `productId` and `storeId`. Product price and stock must stay live while the item sits in the cart, so it references the product rather than copying it. `storeId` is included because this is a multi-vendor marketplace and checkout must split items by vendor.

**Order → OrderItems (embed).** Order lines belong to exactly one order, are always read together with it, and never change after checkout. They are embedded as an array, with snapshot fields (`nameAtPurchase`, `priceAtPurchase`, `unitAtPurchase`, `quantity`, `productId`). The snapshot keeps order history correct even if the product's price or name changes later or the product is deleted.

**Order → Customer and Store (reference).** `customerId` and `storeId` point to the user and store, which exist independently and are queried on their own (a customer's order history, a vendor's incoming orders).

## Actors and collections

**Vendor (role: `vendor`).** A vendor registers as a `users` document with `role: "vendor"`. After registering, they create exactly one `stores` document linked to them through `userId`. They then create `products` documents whose `storeId` points only to their own store; a vendor can never create or edit a product under another vendor's store. A vendor reads only the `orders` where `storeId` matches their own store, and never sees another vendor's orders. Their write access on orders is limited to updating the order `status`.

**Customer (role: `customer`).** A customer registers as a `users` document with `role: "customer"`. They browse `products` across all stores through a public catalogue, with no login needed to look. They create `cartitems` linked to their own `userId`, and one cart can hold items from several vendors at once (each cart item carries its `storeId`). At checkout the system creates one `orders` document per distinct `storeId` in the cart, so each vendor receives only their own part of the purchase.

## Actor × collection access

| Collection | Vendor read | Vendor write   | Customer read   | Customer write      |
| ---------- | ----------- | -------------- | --------------- | ------------------- |
| users      | own         | own register   | own             | own register        |
| profiles   | own         | own            | own             | own                 |
| stores     | own         | own create one | public info     | no                  |
| products   | own store   | own store CRUD | published only  | no                  |
| cartitems  | no          | no             | own             | own                 |
| orders     | own store's | status update  | own as customer | create via checkout |

## Seed data preview

A seed script will create at minimum:

| Entity         | Count          | Purpose            |
| -------------- | -------------- | ------------------ |
| Vendor users   | 2              | Isolation tests    |
| Customer users | 2              | Cart scoping tests |
| Stores         | 2              | One per vendor     |
| Products       | 5-10 per store | Catalogue + cart   |

## Isolation tests to implement

- [ ] Vendor cannot PATCH another vendor's product
- [ ] Vendor cannot PATCH another vendor's store
- [ ] Customer cannot GET another customer's cart
