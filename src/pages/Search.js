import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { LocationForm, BusinessesList, LinkBackHome } from '../components';
import { HEADERS, CORS_HACK, YELP_SEARCH_URL } from '../utils/yelp';

const Hotels = props => {
    const { match: { params: { type } } } = props;
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const fetchHotels = useCallback(location => {
        setError(null);

        axios.get(`${CORS_HACK}${YELP_SEARCH_URL}?term=${type}&location=${location}`, {
            headers: HEADERS,
        }).then(({ data }) => {
            console.log(data);
            if (Array.isArray(data?.businesses)) {
                setResults(data.businesses);
            }
        }).catch(error => {
            if (!!error?.response?.data?.error?.description) {
                setError(error.response.data.error.description);
            }
            console.error(error);
        });
    }, [type]);

    const title = useMemo(() => type.charAt(0).toUpperCase() + type.slice(1) + 's', [type]);

    return(
        <div id="hotels-container">
            <LinkBackHome />
            <h2>Search {title}</h2>
            <LocationForm fetchResults={fetchHotels} />
            <BusinessesList results={results} error={error} />
        </div>
    );
};

export default Hotels;
