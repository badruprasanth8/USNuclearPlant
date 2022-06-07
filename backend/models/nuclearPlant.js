class nuclearPlant {
    constructor(State,Lat,Lng,Value,Percentage) {
      this.state = State;
      this.lat = Lat;
      this.lng = Lng;
      this.value = Value;
      this.percentage = Percentage;
     
      this.toJSON = "{" +
            "\"state\":\"" + this.state + "\"," +
            "\"lat\":" + this.lat + "," +
            "\"lng\":\"" + this.lng + "\"," +
            "\"value\":\"" + this.value + "\"," +
            "\"percentage\":\"" + this.percentage + "\"" +
        "}"
    }
}
module.exports = {
    nuclearPlant : nuclearPlant
}