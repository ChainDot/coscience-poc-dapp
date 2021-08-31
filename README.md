# dApp Coscience

## GuideLine

- 15min presentation (why blockchain, add technical schema)
- 15min Demo (prepare scenario and wallet with name)
- 15min code presentation (make plan for what we will present):
  - README cascade of contracts deployments schema
  - hardhat project => contracts => test => scripts
  - dapp:
    - present briefly the react architecture
    - select important component to show
    - present hooks for IPFS & contract

## TODO in this repo

- /article/:id => Display in a prettier way, separation between Article / Review / ...❌
- refactoring of Header (wrap into a list)❌
- add color theme in Chakra (create a little graphical charter)❌
- add change profile Settings => input (bio, laboratoire)❌
- get the timestamp of each Article/Review/Comment and why not Users. [Use events...]❌
- diplay timestamp correctly ❌
- problem with multiple list of user (RecoverAccount & ListOfUser)❌
- Import PDF and pin it to IPFS (use pinata.fromFS)❌
- Unpin content if TX fail❌
- Refactoring of components (Article in priority, with the crawler maybe)❌
- Crawler with `react-router-dom`❌

```js
articleInfo = {
  title: "",
  content: "",
  pdfFile: "bafkreibbo5dlexsozwr5ac34lfuy6bwq4ixcj5wx5injqa74mlq5wybgs4",
}
```

## TODO in the backend

- deployment on several blockchain (matic & bsc) with the same address ❌

## TODO in data architecture

- create standard for object keys stored in IPFS

Exemple:

```js
userInfo = { firstName: "", lastName: "", email: "" }
```

- keep standards working with a version of this standard

```js
userInfo = { version: 0.1, firstName: "", lastName: "" }
userInfo = { version: 0.2, firstName: "", lastName: "", bio: "" }
```

- save permanent information like name

```js
userInfo = {
  version: 0.3,
  bio: "A",
  laboratory: "A",
  userInfo: "bafkreibbo5dlexsozwr5ac34lfuy6bwq4ixcj5wx5injqa74mlq5wybgs4",
}

newUserInfo = {
  version: 0.3,
  bio: "B",
  laboratory: "B",
  userInfo: "bafkreibbo5dlexsozwr5ac34lfuy6bwq4ixcj5wx5injqa74mlq5wybgs4",
}
```

`userInfo` stay the same

## IPFS data architecture

### Version 0.1

Users:

```js
{
version: 0.1,
userInfo: {
  version: 0.1,
  firstName: "Rogert",
  lastName: "Culinaire"
  },
email: "rogert@food.com",
laboratory: "Ministry of Food",
bio: "Eat some Tacos..."
}
```

Articles:

```js
{
version: 0.1,
title: "Studies on ETH providers",
abstract: "So hard to built this....",
content: {
  version: 0.1,
  content: "For the moment nothing is done..."
  },
}
```

Reviews:

```js
{
version: 0.1,
title: "Pas assez de sources",
content: "L'article est de bonne facture mais manque cruellement de sources"
}
```

Comments:

```js
{ version: 0.1, content: 'blabla' }
```
