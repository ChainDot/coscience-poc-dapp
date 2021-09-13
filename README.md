# dApp Coscience version 0.1

## Architecture

**Schema**

## TODO in this repo

- notifs (article in banning) ONLY for owner (while no governance)
- useIFPS => setTimeout (especially for freshly pinned content) => manage error and display it
- votes on article / review / comment
- Governance => switch owner => governance (display, owner or gov)
- Governance vote for (accept, ban, recover (listOfUser), 3 item ban (Article))
- display votes on Home
- recoverAccount (off chain => Bob send mail to approved member + add a newWallet)

-fix dashboard => tab comment => link to the wrong article

- BACKEND => call need recoverAccount

- General modal (before provider is found) (wrap Dapp) (before load website)

Providers

- change network (not complety finish but OK)
- function to read contract?

Data

- listen event => instant refresh

PREZ

- update diapo

- Crawler with `react-router-dom`❌ (Not in this version)

## TODO in the backend (Not in this version)

- deployment on several blockchain (matic & bsc) with the same address ❌
- add metrics❌ (vote)
- put articleID on indexed ! And author ID❌
- governance (\_users => G(constructor set address user))
  - voting function
  - voting 1 article/r/c (mapping)
  - ?? mapping address => address => uint => uint => bool (need split?)
- ++ replace [] => mapping (compare size & gas) (ERC721Enumerable)

## IPFS data architecture

`String` correspond to a IPFS hash like:  
`bafkreigvjwq6z6tf34cxysyyriq6a7y7fyggpzryfvych6qorpzxjsls6u`

### Version 0.1

Users:

```js
profileCID: String {
  version: 0.1,
  email: "rogert@food.com",
  laboratory: "Ministry of Food",
  bio: "Eat some Tacos...",
  nameCID: String {
    version: 0.1,
    firstName: "Rogert",
    lastName: "Culinaire"
  },
}
```

Articles:

```js
abstractCID: String {
  version: 0.1,
  title: "Studies on ETH providers",
  abstract: "So hard to built this....",
  content: String {
    version: 0.1,
    content: "For the moment nothing is done...",
    pdfFile: String // new feature, almost all articles in this version do not have this key
    },
}
```

Reviews:

```js
contentCID: String {
  version: 0.1,
  title: "Pas assez de sources",
  content: "L'article est de bonne facture mais manque cruellement de sources"
}
```

Comments:

```js
ContentCID: String {
  version: 0.1,
  content: 'blabla'
}
```

## Graphical charter

**Made with [Coolers](https://coolors.co/) & [ColorTool](https://material.io/resources/color/#!/?view.left=0&view.right=0)**

```js
styles = {
  colors: {
    main: '#ff5a23',
    mainLight: '#ff8d51',
    mainDark: '#c42200',
    second: '#17b7ff',
    secondLight: '#6ee9ff',
    secondDark: '#0087cb',
    colorMain: {
      50: '#ff9877',
      100: '#ff8e69',
      200: '#ff835a',
      300: '#ff7749',
      400: '#ff6937',
      500: '#ff5a23',
      600: '#e85220',
      700: '#d34b1d',
      800: '#c0441a',
      900: '#af3e18'
    },
    colorSecond: {
      50: '#60ceff',
      100: '#50c9ff',
      200: '#3fc4ff',
      300: '#2cbeff',
      400: '#17b7ff',
      500: '#15a6e8',
      600: '#1397d3',
      700: '#1189c0',
      800: '#0f7daf',
      900: '#0e729f'
    },
    grayOrange: {
      100: '#E7E5E4',
      200: '#CFCBC9',
      300: '#B6B1AF',
      400: '#9E9694',
      500: '#867C79',
      600: '#6B6361',
      700: '#504B49',
      800: '#363230',
      900: '#1B1918'
    },
    grayBlue: {
      100: '#E4E6E7',
      200: '#C9CDCF',
      300: '#AFB4B6',
      400: '#949B9E',
      500: '#798286',
      600: '#61686B',
      700: '#494E50',
      800: '#303436',
      900: '#181A1B'
    }
  },
  fonts: {
    text: 'Lato, sans-serif',
    title: 'Merriweather, serif'
  }
}
```

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
