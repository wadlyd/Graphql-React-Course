const githubQuery = {
    query: `
      {
        viewer{
          name
        }
        search(query: "user:wadlyd sort:updated-desc", type: REPOSITORY, first: 20) {
              nodes{
                  ... on Repository {
                    name
                    description
                    id
                    url
                    viewerSubscription
                    licenseInfo {
                      spdxId
                    }
              }
          }
        }
      }
    `,
  };

export default githubQuery;