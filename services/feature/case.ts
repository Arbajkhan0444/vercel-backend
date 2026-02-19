const camelCase = (name: string)=>{
    const featureSplit = name.split("-")
    const featureArray = featureSplit.map((item)=>{
        const firstLetter = item[0].toUpperCase()
        const restLetter = item.slice(1)
        return (firstLetter+restLetter)
    })

    const feature = featureArray.join("")
    return feature
}

export default camelCase