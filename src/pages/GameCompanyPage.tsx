import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import "../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {igdbGamesService} from "../api/services/igdbGamesService";
import {IgdbGameList} from "../components/game/list/IgdbGameList";

function GameCompanyPage() {
    const { t } = useTranslation();

    const companySlug = useParams<{ company: string }>();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (companySlug.company !== null && companySlug.company !== "") {
            setIsLoading(true);
            igdbGamesService.getGameCompany(companySlug.company).then(results => {
                setSearchResults(results.at(0));
                setIsLoading(false);
            });
        }
    }, [companySlug]);

    const renderSearchResults = () => {
        if (searchResults?.developed?.length > 0) {
            return (
                <IgdbGameList games={searchResults.developed} gamesPerPage={15}/>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>{t('not_found')}</Alert>
                </Container>
            )
        }
    };

    return (
        <Container>
            <Stack className=".d-flex justify-content-center align-items-center">
                <Container style={{textAlign: "center", width: '35rem'}}>
                    {searchResults?.name != null && (
                        <h2 className='page-title' style={{justifyContent: 'flex-start'}}>
                            {`${t('company')}: ${searchResults.name}`}
                        </h2>)
                    }
                </Container>
                <div style={{paddingBottom:'1.25rem'}}>
                    {searchResults.description}
                </div>
                <Row className="flex-wrap" style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                    {isLoading ? (
                        <Container style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <Spinner animation="border" variant="primary"/>
                        </Container>
                    ) : (
                        <Container className="justify-content-start align-items-center">
                            {renderSearchResults()}
                        </Container>
                    )}
                </Row>
            </Stack>
        </Container>
    );
}

export default GameCompanyPage;