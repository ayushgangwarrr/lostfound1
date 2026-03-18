export const findMatches = (lostItem, items) => {

    return items.filter(item =>
    
    item.type === "found" &&
    
    (
    item.title.toLowerCase().includes(lostItem.title.toLowerCase()) ||
    
    item.location.toLowerCase().includes(lostItem.location.toLowerCase())
    )
    
    );
    
    };