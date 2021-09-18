const getUrlParam = (urlString, paramString) => {
    const url = new URL(urlString);
    return url.searchParams.get(paramString);
}

export {getUrlParam};