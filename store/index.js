export const state = () => ({
  campType: "",
  campCode: "",
  dateStart: "",
  dateEnd: "",
  summary: "",
  getMethod: "",
  ref: "",
  refURL: "",
  benefits: [],
  conditions: [],
  remarks: "",
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
    state.conditions = conditions.conditions;
    state.benefits = conditions.benefits;
    state.remarks = conditions.remarks;
  }
}
