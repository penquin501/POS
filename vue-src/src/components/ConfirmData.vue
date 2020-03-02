<template>
  <div class="container-fluid">
    <section v-if="view == 1">
      <div style="margin-left: 5% ; margin-right: 5%">
        <div class="row">
          <div class="col-sm-12">
            <div class="table-responsive costum-table-dark">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th style="text-align: center ; font-size: 18px;">Tracking</th>
                    <th style="text-align: center ; font-size: 18px;" width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-bind:key="item.id" v-for="(item  , index) in TrackingAll">
                    <td v-on:click="detailTracking(index)">{{TrackingAll[index].tracking}}</td>
                    <td style="background: #4c9ee7"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="view == 2" style="margin-left: 3% ; margin-right: 3%">
      <div>
        <div class="row">
          <div class="col-sm-12">
            <div class="col-sm-4">
              <v-zoomer style="width: 580px; height: 500px;">
                <img
                  :src="img"
                  style="object-fit: contain; width: 100%; height: 100%; "
                  :style="`transform: rotate(${rotation}deg);`"
                />
              </v-zoomer>

              <div style="float: left; margin-top: 5%;">
                <button v-on:click="rotateLeft" class="btn btn-primary">
                  <i class="fa fa-undo" aria-hidden="true" style="font-size: 20px;"></i>
                </button>
                &nbsp;
                <button v-on:click="rotateRight" class="btn btn-primary">
                  <i class="fa fa-repeat" aria-hidden="true" style="font-size: 20px;"></i>
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <!-- <div
                class="panel panel-primary"
                v-bind:key="item.id"
                v-for="(item  , index) in detailDataTracking"
              >-->
              <div class="panel panel-primary">
                <div class="panel-heading">Detail</div>
                <div class="panel-body" style="height: 100%">
                  <div class="row" style="font-size: 20px;">
                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>Tracking</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <!-- <span>{{detailDataTracking[index].QLTracking}}</span> -->
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>Zipcode</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <span>Example</span>
                      </div>
                    </div>

                    <div class="col-sm-12">
                      <div
                        style="background-color: black ; height: 0.1em; margin-top:10px; margin-bottom: 25px;"
                      ></div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>Tracking</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <input
                          class="form-control"
                          type="text"
                          v-model="dataTrackingInput"
                          style="text-transform: uppercase"
                          onKeyPress="if(this.value.length == 12) return false;"
                        />
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>Parcel Type</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <div class="col-sm-6">
                          <label class="container" style="cursor: pointer;">
                            NORMAL
                            <input
                              type="radio"
                              name="radio"
                              v-model="dataSelectParcelType"
                              value="NORMAL"
                              style="position: absolute; opacity: 0; cursor: pointer;"
                            />
                            <span class="checkmark" style="cursor: pointer;"></span>
                          </label>
                        </div>
                        <div class="col-sm-6">
                          <label class="container" style="cursor: pointer;">
                            COD
                            <input
                              type="radio"
                              name="radio"
                              v-model="dataSelectParcelType"
                              value="COD"
                              style="position: absolute; opacity: 0; cursor: pointer;"
                            />
                            <span class="checkmark" style="cursor: pointer;"></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>ชื่อ</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <input
                          class="form-control"
                          type="text"
                          v-model="dataNameInput"
                          maxlength="50"
                        />
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>โทรศัพท์</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <input
                          class="form-control"
                          id="inputPhone"
                          type="text"
                          v-model="dataPhoneInput"
                          v-on:keypress="onlyNumber"
                          maxlength="10"
                        />
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>รหัสไปรษณีย์</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <!-- <input
                          class="form-control"
                          type="text"
                          v-model="dataZipCodeInput"
                          maxlength="5"
                          v-on:keypress="onlyNumber"
                          id="inputZipCode"
                        />
                        </div>-->

                        <div class="searchZipCode">
                          <div v-on:click="clickOpen" v-if="openZipCode">
                            <span
                              v-if="!address.AMPHUR_ID || !address.zipcode "
                              style="font-size: 16px;"
                            >&nbsp;&nbsp;{{this.dataFirstZipCodeInput.zipcode}} &nbsp; {{this.dataFirstZipCodeInput.DISTRICT_NAME}} &nbsp; {{this.dataFirstZipCodeInput.AMPHUR_NAME}} &nbsp; {{this.dataFirstZipCodeInput.PROVINCE_NAME}}</span>
                            &nbsp; &nbsp;
                            <span
                              style="font-size: 16px;"
                            >{{address.zipcode}}&nbsp;</span>
                            <span style="font-size: 16px;">{{address.DISTRICT_NAME}}&nbsp;</span>
                            <span style="font-size: 16px;">{{address.AMPHUR_NAME}}&nbsp;</span>
                            <span style="font-size: 16px;">{{address.PROVINCE_NAME}}&nbsp;</span>
                          </div>
                          <div v-if="!openZipCode">
                            <input
                              class="form-control"
                              type="text"
                              v-model="inputNewGetZipCode"
                              v-on:keyup="newGetZipCode($event)"
                              id="inputZipCode"
                            />
                            <div style="height: 200px ; overflow-y : scroll;">
                              <ol
                                v-bind:key="item.id"
                                v-for="(item , index) in dataFirstGetZipCode"
                                v-on:click="onSelected(item)"
                                class="hoverSelectZipcode"
                                style="padding-left: 5% ; font-size: 16px;"
                              >
                                <li style="list-style-type: none; margin-top: 3%; ">
                                  <div>{{ dataFirstGetZipCode[index].zipcode + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].DISTRICT_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].AMPHUR_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].PROVINCE_NAME }}</div>
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-12" style="margin-bottom: 1%">
                      <div class="col-sm-2">
                        <b>ที่อยู่</b>
                      </div>
                      <div class="col-sm-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-7">
                        <input
                          class="form-control"
                          type="text"
                          v-model="dataAddressInput"
                          maxlength="100"
                        />
                      </div>
                    </div>

                    <button
                      class="btn btn-warning"
                      style="float: right ;  margin-right: 5% ; border-radius: 20px 20px 20px 20px; width: 70px"
                      v-on:click="clearInput"
                    >Clear</button>
                  </div>
                </div>
              </div>
              <button class="btn btn-danger" style="width: 150px; float: left;">ย้อนกลับ</button>
              <button
                class="btn btn-success"
                style="width: 150px; float: right;"
                v-on:click="btnConfirm"
              >ถัดไป</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
const axios = require("axios");
import Vue from "vue";

import VueZoomer from "vue-zoomer";
import Axios from "axios";

Vue.use(VueZoomer);

export default {
  data: function() {
    return {
      img:
        "https://firebasestorage.googleapis.com/v0/b/my945app.appspot.com/o/my945images%2F0624864246%2FTDZ18150561.jpg?alt=media&token=5bfd339d-4e65-44e3-9c18-c08f93119f5b",
      rotation: 0,
      view: 2,
      openCOD: false,

      TrackingAll: [],
      numberTracking: "",

      detailDataTracking: [],

      dataTrackingInput: "",
      dataSelectParcelType: "",
      dataNameInput: "",
      dataPhoneInput: "",
      dataZipCodeInput: "10210",
      dataFirstZipCodeInput: [],
      dataAddressInput: "",

      //searchZipcode
      openZipCode: true,
      dataFirstGetZipCode: [],
      dataNewGetZipCode: [],
      selectZipCode: "",
      inputNewGetZipCode: "",
      address: []
    };
  },
  mounted: function() {
    this.getAllTDZ();
    this.firstGetZipCode();
  },
  methods: {
    rotateRight() {
      this.rotation += 90;
    },
    rotateLeft() {
      this.rotation -= 90;
    },
    getAllTDZ() {
      axios
        .get("http://206.189.85.185:8100/adminCare/trackingAllCare")
        .then(resultGetAllTDZ => {
          this.TrackingAll = resultGetAllTDZ.data;
          this.numberTracking = resultGetAllTDZ.data.tracking;
          console.log(resultGetAllTDZ);
        })
        .catch(error => {
          console.log(error);
        });
    },
    detailTracking(index) {
      this.view = 2;
      console.log(this.TrackingAll[index].tracking);
      axios(
        "http://206.189.85.185:8100/adminCare/trackingAllCarekeyin?tracking=" +
          this.TrackingAll[index].tracking
      )
        .then(resultDataDetailTracking => {
          this.detailDataTracking = resultDataDetailTracking.data;
          // this.dataTrackingInput = resultDataDetailTracking.data[0].QLTracking;
          console.log(resultDataDetailTracking);
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearInput() {
      this.dataNameInput = "";
      this.dataSelectParcelType = "";
      this.dataPhoneInput = "";
      this.dataZipCodeInput = "";
      this.dataAddressInput = "";
      this.dataFirstZipCodeInput.zipcode = "";
      this.dataFirstZipCodeInput.AMPHUR_NAME = "";
      this.dataFirstZipCodeInput.AMPHUR_ID = "";
      this.dataFirstZipCodeInput.DISTRICT_NAME = "";
      this.dataFirstZipCodeInput.DISTRICT_ID = "";
      this.dataFirstZipCodeInput.PROVINCE_NAME = "";
      this.dataFirstZipCodeInput.PROVINCE_ID = "";
      this.dataFirstZipCodeInput.district_code = "";
      this.inputNewGetZipCode = "";
    },

    btnConfirm() {
      var barcodeRE = /^[T|t][D|d][Z|z]+[0-9]{8}[A-Z]?$/i;

      if (!this.dataTrackingInput) {
        this.$dialogs.alert("กรุณากรอกเลขพัสดุ");
      } else if (!this.dataTrackingInput.match(barcodeRE)) {
        this.$dialogs.alert("กรุณากรอกเลขพัสดุให้ถูกต้อง");
      } else if (!this.dataSelectParcelType) {
        this.$dialogs.alert("กรุณาเลือกการชนิดส่ง");
      } else if (!this.dataNameInput) {
        this.$dialogs.alert("กรุณากรอกชื่อ");
      } else if (!this.dataPhoneInput) {
        this.$dialogs.alert("กรุณากรอกเบอร์");
      } else if (this.dataPhoneInput.charAt(0) !== "0") {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      } else if (
        this.listTracking.inputPhoneNumber.charAt(1) !== "8" &&
        this.listTracking.inputPhoneNumber.charAt(1) !== "9"
      ) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      } else if (
        this.listTracking.inputPhoneNumber.charAt(1) !== "8" &&
        this.listTracking.inputPhoneNumber.charAt(1) !== "9"
      ) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
        console.log("phone");
      } else if ($("#inputPhone").val().length != 10) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์มือถือให้ครบ (10 ตัวเลข)");
      } else if (!this.address.zipcode && !this.dataFirstZipCodeInput.zipcode) {
        this.$dialogs.alert("กรุณากรอกรหัสไปรษณีย์");
        // } else if ($("#inputZipCode").val().length != 5) {
        //   this.$dialogs.alert("กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง");
      } else if (!this.dataAddressInput) {
        this.$dialogs.alert("กรุณากรอกที่อยู่");
      }
    },
    onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault();
      }
    },

    firstGetZipCode() {
      console.log("first get");
      axios
        .get(
          "http://206.189.85.185:8100/billingPos/checkZipcode/?zipcode=" +
            this.dataZipCodeInput
        )
        .then(resultsFirstGetZipCode => {
          this.dataFirstGetZipCode = resultsFirstGetZipCode.data;
          // this.dataFirstGetZipCode = resultsFirstGetZipCode.data[0];
          this.dataFirstZipCodeInput = resultsFirstGetZipCode.data[0];
          console.log(resultsFirstGetZipCode);
          console.log(this.dataFirstZipCodeInput);
        })
        .catch(error => {
          console.log(error);
        });
    },

    newGetZipCode(envet) {
      console.log(this.inputNewGetZipCode);
      if (
        !this.inputNewGetZipCode ||
        this.inputNewGetZipCode.length == 2 ||
        this.inputNewGetZipCode.length == 1
      ) {
        axios
          .get(
            "http://206.189.85.185:8100/billingPos/checkZipcode/?zipcode=101"
          )
          .then(resultsDataNewGetZipCode => {
            this.dataFirstGetZipCode = resultsDataNewGetZipCode.data;
            console.log(resultsDataNewGetZipCode);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios
          .get(
            "http://206.189.85.185:8100/billingPos/checkZipcode/?zipcode=" +
              this.inputNewGetZipCode
          )
          .then(resultsDataNewGetZipCode => {
            this.dataFirstGetZipCode = resultsDataNewGetZipCode.data;
            console.log(resultsDataNewGetZipCode);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    onSelected(obj) {
      this.address = obj;
      this.openZipCode = true;
    },
    clickOpen() {
      axios
        .get("http://206.189.85.185:8100/billingPos/checkZipcode/?zipcode=101")
        .then(resultsDataNewGetZipCode => {
          this.dataFirstGetZipCode = resultsDataNewGetZipCode.data;
          console.log(resultsDataNewGetZipCode);
          this.openZipCode = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    clickClose() {
      this.openZipCode = true;
    }
  }
};
</script>
<style>
.costum-table-dark .table th {
  /* padding: 15px 10px !important; */
  height: 100%;
  background-color: #337ab7;
  color: #ffffff;
  border-top: 0 !important;
  border-bottom: 2px solid #e6e6e6 !important;
}
.costum-table-dark .table tr:hover {
  background-color: #4c9ee7;
  color: rgb(255, 255, 255);
  cursor: pointer;
}
.costum-table-dark .table {
  background: #f0f0f0;
  color: rgb(0, 0, 0);
  border-bottom: 2px solid #e6e6e6 !important;
}
.costum-table-dark {
  border: 0;
}

/* input[type="text"] {
  height: 17px;
  border: 0;
  width: calc(100% - 2px);
  margin-left: 1px;
  box-shadow: -8px 10px 0px -7px #ebebeb, 8px 10px 0px -7px #ebebeb;
  -webkit-transition: box-shadow 0.3s;
  transition: box-shadow 0.3s;
  font-size: 20px;
}
input[type="text"]:focus {
  outline: none;
  box-shadow: -8px 10px 0px -7px #4ea6ea, 8px 10px 0px -7px #4ea6ea;
} */
/* 
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
} */

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  /* margin-bottom: 12px; */
  /* font-size: 22px; */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>