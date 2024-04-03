export default defineEventHandler(async (event) => {

    // handle query params 
    const { name } = getQuery(event)

    // handle post data 
    const { age } = await readBody(event)


    // server fetch, e.g currencyapi
    // const { data } = await $fetch();

    return {
        message: `Hello, ninjas ${name}, age is: ${age}`
    }
})