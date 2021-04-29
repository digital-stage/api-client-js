import Router from '../../types/model/Router';

interface Routers {
  byId: {
    [id: string]: Router;
  };
  byCountryCode: {
    [countryCode: string]: string[];
  };
  byCity: {
    [city: string]: string[];
  };
  byType: {
    [type: string]: string[];
  };
  allIds: string[];
}

export default Routers;
