
const initialState = {
    userLocation: null,
    displayNearestBuildings: false,
    isSubscribed: false,
}


const map = (state = initialState, action) => {
    switch (action.type) {
    case 'USER_DROP_PIN':
      return {
        userLocation: (action.event.latLng) ? action.event.latLng : null,
    }
    case 'SUBSCRIBED':
    return {
        userLocation: state.userLocation,
        displayNearestBuilding: true,
        isSubscribed: true
    }
    case 'USER_BUILDING_CLICK':
      return {
          infoWindowBuilding: action.building,
      }
    default:
      return state
  }
}

export default map;
