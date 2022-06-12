import { useEffect, useState, useCallback } from "react";
import github from "./db.js";
import NavButtons from "./NavButtons.js";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox.js";

function App() {
  const [userName, setUserName] = useState("");
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(20);
  const [queryString, setQueryString] = useState("");
  const [totalCount, setTotalCount] = useState(null);


  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPaginationString] = useState("");


  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;
        const start = data.data.search.pageInfo?.endCursor;
        const end = data.data.search.pageInfo?.startCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasPreviousPage;

        setUserName(viewer.name);
        setRepoList(repos);
        setTotalCount(total);
        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString, paginationString, paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"> repo</i>
      </h1>
      <p>Hey there {userName} </p>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => {
          setPageCount(myNumber);
        }}
        onQueryChange={(myString) => {
          setQueryString(myString);
        }}
      />
      <NavButtons 
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString)
        }}
      />
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map((repo) => (
            <RepoInfo key={repo.node.id} repo={repo.node} />
          ))}
        </ul>
      )}
      <NavButtons 
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString)
        }}
      />
    </div>
  );
}

export default App;
