import Stage from "../../types/model/Stage";

interface Stages {
  byId: {
    [id: string]: Stage;
  };
  allIds: string[];
}

export default Stages;
