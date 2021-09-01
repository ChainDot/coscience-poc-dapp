# dApp Coscience

## GuideLine

- 5min Presentation (add architecture & technologie schema)
- 10min Demo (register, reverts, publish, post, edit profile)
- 15min Code (50/50 back/front)

  - README cascade of contracts deployments schema
  - hardhat project => contracts => test => scripts
  - dapp:
    - present briefly the react architecture
    - select important component to show
    - present hooks for IPFS & contract

## Graphical charter

Colors:
Main color: `#ff5a23`  
Secondary color: `#17b7ff`

white on main: `#c42200`  
dark on main: `#ff8d51`  
white on secondary: `#0087cb`  
dark on secondary: `#6ee9ff`

main gray: `#FFECE6`  
secondary gray: `#F2FBFF`

Fonts:  
Need to fetch it
Title: `Merriweather` or more fancy like `Forum` or `Elsie` But can be only a logo ! (avoid to load too much font in the Web App)  
Text: `Lato`  
Read-sans-serif: `Lato`  
Read-serif: `Merriweather`

## TODO in this repo

- refactoring Profile responsive ❌
- problem with multiple list of user (RecoverAccount & ListOfUser in the hook)❌
- Import PDF and pin it to IPFS (use pinata.fromFS) INTEGRATE to function publish ❌
- PDF hash =>

```js
header: {
  version: 0.1,
  title: "Studies on ETH providers",
  abstract: "So hard to built this....",
  content: (hash) {
    version: 0.1,
    content: "For the moment nothing is done...",
    pdfFile: hash
    },
}
```

- manage article/undefined article❌ => 404
- add color theme in Chakra (create a little graphical charter)❌
- Crawler with `react-router-dom`❌

```js
articleInfo = {
  title: "",
  content: "",
  pdfFile: "bafkreibbo5dlexsozwr5ac34lfuy6bwq4ixcj5wx5injqa74mlq5wybgs4",
}
```

- REVIEW DAPP (inspect & write comment) => Architecture
- README
- MERGE with main

## TODO in the backend

- deployment on several blockchain (matic & bsc) with the same address ❌
- add metrics❌
- put articleID on indexed ! And author ID❌
- governance (see tomorrow the openzepplin live at 9PM)
- ++ replace [] => mapping

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
