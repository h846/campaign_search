export const state = () => ({
  campType: "",
  campCode: "",
  dateStart: "",
  dateEnd: "",
  summary: "",
  getMethod: "",
  ref: "",
  refURL: "",
  freeShip: false,
  condition1: [],
  condition2: ""
})

export const mutations = {
  setCampInfo(state, campInfo) {
    state.campType = campInfo.type;
    state.campCode = campInfo.code;
    state.dateStart = campInfo.startDate;
    state.dateEnd = campInfo.endDate;
  },
  setDetails(state, details) {
    state.summary = details.summary;
    state.getMethod = details.getMethod;
    state.ref = details.ref;
    state.refURL = details.refURL;
  },
  setConditions(state, conditions) {
    state.freeShip = conditions.freeShip;
    state.condition1 = conditions.condition1;
    state.condition2 = conditions.condition2;
  }
}
