fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                    query{
                        inventory{
                            error,
                            items{
                                index
                            }
                        }
                    }
                `
        })
    }).then((result) => result.json())
    .then(data => console.log(data))
    .catch(e => {
        console.log(e);
    })