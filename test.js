{
  isOwner ? (
    owner !== governance.address ? (
      <Button
        onClick={() => banArticle(article.id)}
        isLoading={status.startsWith('Waiting') || status.startsWith('Pending')}
        loadingText={status}
        disabled={status.startsWith('Waiting') || status.startsWith('Pending')}
      >
        Ban
      </Button>
    ) : (
      <Button
        onClick={() => voteToBanUser(article.id)}
        isLoading={status.startsWith('Waiting') || status.startsWith('Pending')}
        loadingText={status}
        disabled={status.startsWith('Waiting') || status.startsWith('Pending')}
      >
        Ban Governance
      </Button>
    )
  ) : (
    ''
  )
}
