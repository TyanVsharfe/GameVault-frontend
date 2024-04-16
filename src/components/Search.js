import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import SearchComponent from "./SearhComponent";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            const results = JSON.parse(localStorage.getItem("game_list"));
            const loading = localStorage.getItem("loading");

            setSearchResults(results);
            setIsLoading(loading);
        };

        fetchData();
    }, []);

    return (
        <Container>
            {/*            <div className="search-result" id="search-result">
                <h1>Search</h1>
                <div id="resultList">
                    {isLoading && <SearchComponent searchResults={searchResults} />}
                </div>
            </div>*/}
            <Stack className=".d-flex justify-content-center align-items-center">
                <h2>Search result</h2>
                <Row className="flex-wrap" style={{ display: 'flex', alignItems: 'flex-end' }} gap="4">
                    {isLoading && <SearchComponent searchResults={searchResults}/>}
                </Row>
            </Stack>
        </Container>
    );
}

export default Search;