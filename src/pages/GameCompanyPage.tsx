import React, {useEffect, useState} from "react";
import {Alert, Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import "../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {igdbGamesService} from "../api/services/igdbGamesService";
import {IgdbGameList} from "../components/game/list/IgdbGameList";
import {Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography} from "@mui/joy";
import {Helmet} from "react-helmet-async";

function GameCompanyPage() {
    const { t } = useTranslation();

    const companySlug = useParams<{ company: string }>();
    const [companyName, setCompanyName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (companySlug.company !== null && companySlug.company !== "") {
            setIsLoading(true);
            igdbGamesService.getGameCompany(companySlug.company).then(results => {
                setSearchResults(results.at(0));
                setCompanyName(results.at(0).name);
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
                <Box style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>{t('not_found')}</Alert>
                </Box>
            )
        }
    };

    return (
        <>
            <Helmet>
                <title>{companyName} | GameVault</title>
            </Helmet>
            <Box sx={{width: '70rem', alignItems: 'center', margin: 'auto'}} >
                <Stack className=".d-flex justify-content-center align-items-center">
                    <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        {searchResults?.name != null && (
                            <h2 className='page-title' style={{justifyContent: 'flex-start'}}>
                                {`${t('company')}: ${searchResults.name}`}
                            </h2>)
                        }
                        <img style={{height: '5rem'}}
                             src={searchResults?.logo?.url.replace("t_thumb", "t_1080p").replace('.jpg', '.png')}/>
                    </Box>
                    <div style={{width:'100%'}}>
                        <Accordion sx={{fontSize: '1.5rem', alignItems: 'start'}}>
                            <AccordionSummary>{t('description')}</AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {searchResults.description}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        {/*<Divider sx={{*/}
                        {/*    color: 'black',*/}
                        {/*    textColor: 'black',*/}
                        {/*    bgColor: 'black',*/}
                        {/*    height: '2.5rem',*/}
                        {/*    marginBottom: '1rem'*/}
                        {/*}}>*/}
                        {/*    {t('company_games')}*/}
                        {/*</Divider>*/}
                        <Divider style={{margin: '1.5rem'}} component="div" role="presentation"/>
                    </div>
                    <Row className="flex-wrap" style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                        {isLoading ? (
                            <Box style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                                <Spinner animation="border" variant="primary"/>
                            </Box>
                        ) : (
                            <Box className="justify-content-start align-items-center">
                                {renderSearchResults()}
                            </Box>
                        )}
                    </Row>
                </Stack>
            </Box>
        </>
    );
}

export default GameCompanyPage;