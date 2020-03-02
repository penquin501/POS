<template>
  <div  id="app">
    <div class="container">
      <section v-if="register == 1" style="margin-left: 3% ; margin-right: 3%">
        <!-- <PreventUnload :when="hasChanges" /> -->
        <div class="panel panel-primary">
          <div class="panel-heading" style="text-align:center;">
            <b style="font-size:18px;">ข้อมูลประจำตัวสมาชิก</b>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 20px;margin-top: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>เลขบัตรประชาชน</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="เลขบัตรประชาชน ไม่เกิน 13 หลัก"
                    class="form-control"
                    type="text"
                    onKeyPress="if(this.value.length==13) return false;"
                    v-on:keypress="onlyNumber"
                    v-model="idCardCode"
                    autofocus
                    ref="idCardCode"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>เบอร์โทรศัพท์</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="เบอร์โทรศัพท์มือถือ"
                    class="form-control"
                    type="text"
                    onKeyPress="if(this.value.length==10) return false;"
                    v-on:keypress="onlyNumber"
                    v-model="phoneNumber"
                    id="inputPhone"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>

              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>ชื่อ</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="ชื่อ : ไม่เกิน 30 ตัวอักษร"
                    class="form-control"
                    type="text"
                    onKeyPress="if(this.value.length==30) return false;"
                    v-model="firstName"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>นามสกุล</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="นามสกุล : ไม่เกิน 30 ตัวอักษร"
                    class="form-control"
                    type="text"
                    onKeyPress="if(this.value.length==30) return false;"
                    v-model="lastName"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>ชื่อร้าน</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="ชื่อร้าน / องค์กร / บริษัท / ตัวแทน : ไม่เกิน 50 ตัวอักษร"
                    class="form-control"
                    type="text"
                    maxlength="50"
                    v-model="nameCompany"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>

              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>ที่อยู่ติดต่อ</b>
                </div>
                <div class="col-sm-10">
                  <input
                    placeholder="ที่อยู่ติดต่อ - ส่งพัสดุกลับ : ไม่เกิน 50 ตัวอักษร"
                    class="form-control"
                    type="text"
                    maxlength="50"
                    v-model="addressRegister"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style=" margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>รหัสไปรษณีย์</b>
                </div>
                <div class="col-sm-10">
                  <div class="searchZipCode">
                    <div v-on:click="clickOpen" v-if="openZipCode">
                      <span
                        v-if="!address.AMPHUR_ID || !address.zipcode "
                        style="color: #9999a3"
                      >&nbsp;&nbsp;รหัสไปรษณีย์</span>
                      &nbsp; &nbsp;
                      <span>{{address.zipcode}}&nbsp;</span>
                      <span>{{address.DISTRICT_NAME}}&nbsp;</span>
                      <span>{{address.AMPHUR_NAME}}&nbsp;</span>
                      <span>{{address.PROVINCE_NAME}}&nbsp;</span>
                    </div>
                    <div v-if="!openZipCode">
                      <input
                        class="form-control"
                        type="text"
                        v-model="inputNewGetZipCode"
                        v-on:keyup="firstGetZipCode(inputNewGetZipCode , $event)"
                        id="inputZipCode"
                      />
                      <div style="height: 200px ; overflow-y : scroll;">
                        <ol
                          v-bind:key="item.id"
                          v-for="(item , index) in dataFirstGetZipCode"
                          v-on:click="onSelected(item)"
                          class="hoverSelectZipcode"
                          style="padding-left: 5%"
                        >
                          <li style="list-style-type: none; margin-top: 3%;">
                            <div>{{ dataFirstGetZipCode[index].zipcode + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].DISTRICT_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].AMPHUR_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[index].PROVINCE_NAME }}</div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>
          </div>
        </div>
  <div class="panel panel-primary">
            <div class="panel-heading" style="text-align:center;">
              <b style="font-size:18px;">ภาพถ่ายบัตรประชาชน</b>
            </div>
            <div class="panel-body">
              <div class="col-sm-12">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                   <div class="center">
                <div class="upload-btn-wrapper">
                  <button class="btn-up"><i class="fa fa-camera" style="font-size: 30px;" aria-hidden="true"></i></button>
                  <input id="file" type="file" name="myfile"  
                              accept="image/*"
                      @change="onFileChange"
                      ref="url"
                      v-on:change="handleFileUploadCitizen" />
                </div>
                    </div>
                  <div>
                    <div id="preview">
                      <img v-img class="responsive" v-if="url" :src="url" style="margin-top: 5%" />
                    </div>
                  </div>
                </div>
                <div class="col-sm-4"></div>
              </div>
            </div>
          </div>


          <div class="row">
              <toggle-button
              color="#337ab7"
              :width="100"
              :height="30"
              :labels="{checked: 'COD', unchecked: 'เปิด COD'}"
              style="float: right; "
              v-model="openCOD"
              v-on:change="getDataBank($event)"
            />
          </div>
      </section>


<section v-if="openCOD == true">
       <div  class="panel panel-primary">
          <div class="panel-heading" style="text-align:center;">
            <b style="font-size:18px;">ข้อมูลธนาคาร</b>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 20px;margin-top: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>ธนาคาร</b>
                </div>
                <div class="col-sm-10">
                  <select
                    class="form-control dropdown-panel-detail"
                    v-model="codeBank"
                    @change="onChange($event)"
                  >
                    <option disabled selected>เลือกธนาคาร</option>
                    <option
                      v-bind:key="item.id"
                      v-for="(item  , index) in dataBank"
                      v-bind:value="{ id: dataBank[index].id, text: dataBank[index].bankTh }"
                    >{{ dataBank[index].bankTh }}</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>เลขที่บัญชี</b>
                </div>
                <div class="col-sm-10">
                  <input
                    v-on:keypress="onlyNumber"
                    v-model="numberBank"
                    placeholder="เลขที่บัญชี"
                    class="form-control"
                    type="text"
                    maxlength="12"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>รหัสสาขา</b>
                </div>
                <div class="col-sm-10">
                  <input
                    v-model="branchBank"
                    placeholder="รหัสสาขา"
                    class="form-control"
                    type="text"
                    maxlength="3"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>

            <div class="row" style="margin-bottom: 20px;">
              <div class="col-sm-1"></div>
              <div class="col-sm-10">
                <div class="col-sm-2">
                  <b>ชื่อบัญชี</b>
                </div>
                <div class="col-sm-10">
                  <input
                    v-on:keypress="inputCheckFormatName"
                    v-model="nameBank"
                    placeholder="ชื่อบัญชี"
                    class="form-control"
                    type="text"
                    maxlength="100"
                  />
                </div>
              </div>
              <div class="col-sm-1"></div>
            </div>
          </div>
        </div>




        <div  class="panel panel-primary">
          <div class="panel-heading" style="text-align:center;"> <b style="font-size:18px;">ภาพถ่ายหน้าบัญชี</b></div>
          <div class="panel-body">
            <div class="col-sm-12">
              <div class="col-sm-4"></div>
              <div class="col-sm-4">
                <div class="center">
                <div class="upload-btn-wrapper">
                  <button class="btn-up"><i class="fa fa-camera" style="font-size: 30px;" aria-hidden="true"></i></button>
                  <input type="file" name="myfile"  
                             accept="image/*"
                              @change="onFileChangeBookBank"
                              ref="urlBank"
                             v-on:change="handleFileUploadBookBank" />
                </div>
                    </div>
                <!-- <div class="center">
                  <input
                    id="fileBank"
                    type="file"
                    accept="image/*"
                    @change="onFileChangeBookBank"
                    ref="urlBank"
                    v-on:change="handleFileUploadBookBank"
                  />

                  <label for="fileBank" class="btn-1">
                    <i class="fa fa-camera" style="font-size: 30px;" aria-hidden="true"></i>
                  </label>
                </div> -->
                <div>
                  <div id="preview">
                    <img
                      v-img
                      class="responsive"
                      v-if="urlBank"
                      :src="urlBank"
                      style="margin-top: 5%"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-4"></div>
            </div>
          </div>
        </div>
</section>


        <div class="row" style="margin-top: 3% ;" >
          <div class="col-sm-1"></div>
          <div class="col-sm-10">
                        <button class="btn btn-success form-control" v-on:click="btnNextTakeImage()">
              <i class="fa fa-check-circle" aria-hidden="true" style="color: white ; "></i>  บันทึก
             
            </button>
          </div>
          <div class="col-sm-1"></div>
        </div>


      <div v-show="showBtn">
        <button v-on:click="showdia" id="showsuccess"></button>
        <button v-on:click="showidcard" id="showidcard"></button>
        <button v-on:click="showall" id="showall"></button>
        <button v-on:click="showphone" id="showphone"></button>
      </div>

      <!-- modal -->
      <sweet-modal icon="success" ref="modal">ลงทะเบียนสำเร็จ</sweet-modal>
      <sweet-modal icon="error" ref="erroridcard">ลงทะเบียนไม่สำเร็จ, กรุณาตรวจสอบรหัสบัตรประชาชน</sweet-modal>
      <sweet-modal
        icon="error"
        ref="errorall"
      >ลงทะเบียนไม่สำเร็จ, กรุณาตรวจสอบข้อมูลและลงทะเบียนใหม่อีกครั้ง</sweet-modal>
      <sweet-modal icon="error" ref="errorphone">ลงทะเบียนไม่สำเร็จ, เบอร์โทรศัพท์นี้ได้ลงทะเบียนแล้ว</sweet-modal>
      <!--end modal -->
      <section v-if="register == 4" style="margin-left: 3% ; margin-right: 3%">
        <create-bill></create-bill>
      </section>
    </div>

    <!-- Modal HTML -->
    <div id="myModalSuccess" class="modal fade">
      <div class="modal-dialog modal-confirm">
        <div class="modal-content">
          <div class="modal-header">
            <div class="icon-box">
              <img src="../assets/img/checked-symbol.png" height="35px" style=" margin-top: 15px;" />
            </div>
            <h4 class="modal-title">บันทึกข้อมูลสำเร็จ</h4>
          </div>
          <div class="modal-body">
            <!-- <p class="text-center">Your booking has been confirmed. Check your email for detials.</p> -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-success btn-block" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
import CreateBill from "../components/CreateBill.vue";
// import PreventUnload from "vue-prevent-unload";
import Vue from "vue";

// Vue.use(PreventUnload);
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
export default {
  name: "app",
  props: ["value"],
  components: {
    // PreventUnload,
    CreateBill,
    SweetModal,
    SweetModalTab
  },
  data: function() {
    return {
      showBtn: false,
      hasChanges: true,
      createBill: false,
      //page
      register: 1,
      openCOD: false,
      //searchZipcode
      openZipCode: true,
      dataFirstGetZipCode: [],
      dataNewGetZipCode: [],
      selectZipCode: "",
      inputNewGetZipCode: "",
      address: [],

      url: null,
      urlBank: null,

      //dataCustomer
      idCardCode: "",
      phoneNumber: "",
      phone: "",
      firstName: "",
      lastName: "",
      nameCompany: "",
      addressRegister: "",
      aliasName: "",
      // zipcode: "",
      codeBank: "เลือกธนาคาร",
      numberBank: "",
      branchBank: "",
      nameBank: "",
      //data Picture
      imgIdCardCode: "",
      imgBookBank: "",

      dataBank: [],

      dataRegisterRe: [],

      //data Login
      // datamerid: value,

      isProcessing: false,
      appenData: true
    };
  },
  mounted: function() {
    var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
    if (localStorage.dataLogin || dataLogin != null ){
    var dataRegisterRe = JSON.parse(localStorage.getItem("dataRegisterRE"));
    if (dataRegisterRe) {
      this.firstGetZipCode("101");
      this.idCardCode = dataRegisterRe.citizenId;
      this.firstName = dataRegisterRe.firstName;
      this.lastName = dataRegisterRe.lastName;
      this.addressRegister = dataRegisterRe.address;
      this.nameCompany = dataRegisterRe.aliasName;
      this.phoneNumber = dataRegisterRe.phone;
      // this.address.zipcode = dataRegisterRe.zipCode;
     this.handleFileUploadCitizen = dataRegisterRe.imgCitizenIdUrl;
      // urlBank  = dataRegisterRe.imgBookBankUrl;
      this.nameCompany = dataRegisterRe.aliasName;
      this.phoneNumber = dataRegisterRe.phone;

    }
    this.firstGetZipCode("101");
    this.getDataBank();
    this.$refs.idCardCode.focus();

   }else{
     window.location.reload();
    }
  },

  methods: {
    showdia() {
      this.$refs.modal.open();
      localStorage.removeItem("dataRegisterRE");
      setTimeout(function() {
        location.reload();
      }, 2000);
    },
    showidcard() {
      this.$refs.erroridcard.open();
      // setTimeout(function() {
      //   location.reload();
      // }, 2000);
    },
    showall() {
      this.$refs.errorall.open();
      // setTimeout(function() {
      //   location.reload();
      // }, 2000);
    },
    showphone() {
      this.$refs.errorphone.open();
      // setTimeout(function() {
      //   location.reload();
      // }, 2000);
    },

    onlyNumber($event) {
       var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      //console.log($event.keyCode); //keyCodes value
      // let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // if (keyCode < 48 || keyCode > 57) {
      //   // 46 is dot
      //   $event.preventDefault();
      
    },
    inputCheckFormatName($event) {
      var keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (!(keyCode < 48 || keyCode > 57)) {
        $event.preventDefault();
      }
    },
    getDataBank(index) {
      axios
        .get("https://www.945api.com/parcel/agent/bank/name")
        .then(resultsDataBank => {
          this.dataBank = resultsDataBank.data;
        })
        .catch(error => {
          // console.log(error);
        });
    },

    firstGetZipCode(inputZipcode) {
      var zipcode = "";
      if (inputZipcode.length > 2 && inputZipcode.length < 6) {
        zipcode = inputZipcode;
        axios
          .get(
            "https://pos.945.report/billingPos/checkZipcode/?zipcode=" +
              zipcode
          )
          .then(resultsZipCode => {
            if (resultsZipCode.data == false) {
              zipcode = zipcode[0] + zipcode[1] + zipcode[2];
            } else {
              this.dataFirstGetZipCode = resultsZipCode.data;
            }
          })
          .catch(error => {
            // console.log(error);
          });
      } else {
        zipcode = "";
      }
    },

    onSelected(obj) {
      this.address = obj;
      this.openZipCode = true;
    },
    clickOpen() {
      this.openZipCode = false;  
    },

    clickClose() {
      this.openZipCode = true;
    },

    btnNextTakeImage() {
      const options = { okLabel: "ตกลง" };
      var phone = this.phoneNumber;
      var dataPhone;
      if (!this.idCardCode) {
        this.$dialogs.alert("กรุณากรอกรหัสบัตรประชาชนให้ถูกต้อง", options);
      } else if (this.idCardCode.length != 13) {
        this.$dialogs.alert("กรุณากรอกรหัสบัตรประชาชนให้ครบ", options);
      } else if (!this.phoneNumber) {
        this.$dialogs.alert("กรุณากรอกเบอร์มือถือ", options);
      } else if (this.phoneNumber.length != 10) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์มือถือให้ครบ", options);
      } else if (
        !(
          phone[0] + phone[1] == "06" ||
          phone[0] + phone[1] == "08" ||
          phone[0] + phone[1] == "09"
        )
      ) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์มือถือเท่านั้น", options);
      } else if (!this.firstName) {
        this.$dialogs.alert("กรุณากรอกชื่อ", options);
      } else if (!this.lastName) {
        this.$dialogs.alert("กรุณากรอกนามสกุล", options);
      }  else if (!this.nameCompany) {
        this.$dialogs.alert("กรุณากรอกชื่อร้าน", options);
      }else if (!this.addressRegister) {
        this.$dialogs.alert("กรุณากรอกที่อยู่", options);
      } else if (!this.address.zipcode) {
        this.$dialogs.alert("กรุณากรอกรหัสไปรษณีย์", options);
      } else if (!this.url) {
        this.$dialogs.alert("กรุณาอัพโหลดภาพถ่ายบัตรประชาชน", options);
      }
    
      // เมื่อเปิด COD
      else if (this.openCOD == true) {
        if (this.codeBank == "เลือกธนาคาร") {
          this.$dialogs.alert("กรุณาเลือกธนาคาร", options);
        } else if (!this.numberBank) {
          this.$dialogs.alert("กรุณากรอกเลขที่บัญชี", options);
        }else if (this.numberBank.length != 12) {
          this.$dialogs.alert("กรุณากรอกเลขที่บัญชีให้ครบ", options);
        }else if (!this.nameBank) {
          this.$dialogs.alert("กรุณากรอกชื่อบัญชี", options);
        } else if (!this.urlBank) {
          this.$dialogs.alert("กรุณาอัพโหลดภาพถ่ายหน้าบัญชี", options);
        }
        else {
          this.checkPhoneNo(this.phoneNumber);
          // this.register = 2;
        }
      } else {
        this.checkPhoneNo(this.phoneNumber);
        // console.log("data",this.dataPhone);
        // this.register = 2;
      }
    },

    checkPhoneNo(phone) {
      // console.log("checkPhoneNo เช็คเบอร์มือถือ");
      const options = { okLabel: "ตกลง" };
      var ph = phone;
      if (
        ph[0] + ph[1] == "06" ||
        ph[0] + ph[1] == "08" ||
        ph[0] + ph[1] == "09"
      ) {
        var phoneNO = "66";
        for (let i = 1; i < ph.length; i++) {
          phoneNO += ph[i];
        }
      }
      axios
        .get(
          // "http://206.189.85.185:8100/member/checkPhoneNo/?phoneNo=",
          "https://pos.945.report/member/checkPhoneNo/?phoneNo=" + phoneNO
        )
        .then(response => {
          if (response.data == false) {
            this.$dialogs.alert(
              "เบอร์โทรศัพท์นี้ได้ลงทะเบียนแล้ว, กรุณาใช้เบอร์โทรศัพท์อื่นเพื่อลงทะเบียน",
              options
            );
          } else {
            // ตรวจสอบเบอร์โทรเสร็จ ทำการอัพโหลดรุปภาพต่อ
            // alert("ไปอัพโหลดรุปภาพ");
            this.uploadImgRegister();
            // this.register = 2;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    uploadImgRegister(){
      if(this.url != null && this.urlBank  == null){
        // console.log("มีบัตรประชาชน");
        let formDataCitizen = new FormData();
        formDataCitizen.append("file", this.file);
        function main() {
        return axios
          .post("https://api.945cs.work/upload_frontend", formDataCitizen, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(data => {
            return data.data;
          });
      }
      main().then(data => {
        this.imgIdCardCode = data.fileName;
        // console.log("ชื่อรุปบัตรประชาชน", this.imgIdCardCode);
        // alert("ส่งไปเซฟ");
        this.saveRegister();
      });
      }else{
        //  console.log("มีบัตรประชาชน มีหน้าบัญชี");
         this.upLoadImgCitizen();
      }
    },
      saveRegister() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      var branch_id = dataLogin.merid;
      // console.log("branch_id", branch_id);
      var imgBankPath;
      var alaisName;
      var bankIssue;
      var branchCode;
      var bankacc;
      var nameBank;
      var ph = this.phoneNumber;

      if (!this.nameCompany) {
        alaisName = this.firstName + " " + this.lastName;
      } else {
        alaisName = this.nameCompany;
      }

      if(this.imgBookBank){
        imgBankPath =
          "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
          this.imgBookBank;
      }else{
        imgBankPath = "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/5e508c1b_no-image-available.png";
      }

      if (this.codeBank.text == undefined) {
        bankIssue = "";
      } else {
        bankIssue = this.codeBank.text;
      }

      if (this.branchBank == undefined) {
        branchCode = "";
      } else {
        branchCode = this.branchBank;
      }

      if (this.numberBank == undefined) {
        bankacc = "";
      } else {
        bankacc = this.numberBank;
      }

      if (this.nameBank == undefined) {
        nameBank = "";
      } else {
        nameBank = this.nameBank;
      }

        //Setlocalstorage
        var dataRegisterRe = {
        citizenId: this.idCardCode,
        firstName: this.firstName,
        lastName: this.lastName,
        aliasName: this.nameCompany,
        phone: this.phoneNumber,
        address:this.addressRegister,
        zipCode: this.address.DISTRICT_NAME +
          " " +
          this.address.AMPHUR_NAME +
          " " +
          this.address.PROVINCE_NAME +
          " " +
          this.address.zipcode,
        bankIssue: bankIssue,
        bankBranchBode: branchCode,
        bankAcc: bankacc,
        bankAccName: nameBank,
        imgCitizenIdUrl:
          "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
          this.imgIdCardCode,
        imgBookBankUrl: imgBankPath,
        source:"parcel"
      };
      localStorage.setItem("dataRegisterRE", JSON.stringify(dataRegisterRe));

      // SetSaveRegister
      var dataRegister = {
        merId: branch_id,
        citizenId: this.idCardCode,
        firstName: this.firstName,
        lastName: this.lastName,
        aliasName: alaisName,
        phone: ph,
        address:
          this.addressRegister +
          " " +
          this.address.DISTRICT_NAME +
          " " +
          this.address.AMPHUR_NAME +
          " " +
          this.address.PROVINCE_NAME +
          " " +
          this.address.zipcode,
        bankIssue: bankIssue,
        bankBranchCode: branchCode,
        bankAcc: bankacc,
        bankAccName: nameBank,
        imgCitizenIdUrl:
          "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
          this.imgIdCardCode,
        imgBookBankUrl: imgBankPath,
        source:"parcel"
      };
       var jsonRE = JSON.stringify(dataRegister);
        // รอยิงส่งเซฟ
        axios
        .post(
          "https://www.945api.com/parcel/agent/register/api",
          JSON.stringify(dataRegister)
        )
        .then(function(response) {
          // console.log(response.data.status);
          if (response.data.status == "SUCCESS") {
            // ลงข้อมูลสำเร็จ
              $('#showsuccess').click();
          } 
          else if (response.data.status == "ERROR_ID_CARD_WRONG") {
            // เลขบัตรประชาชน
           $('#showidcard').click();
          }
          else if (response.data.status == "ERROR_DUPLICATE_MEMBER") {
            // เลขซ้ำmemberซ้ำตรวจสอบ เบอร์ เลขปชช
             $('#showphone').click();
          }
          else  {
            $('#showall').click();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      },













    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },

    onFileChangeBookBank(e) {
      const fileBank = e.target.files[0];
      this.urlBank = URL.createObjectURL(fileBank);
    },

    btnBackToDetailCustomer() {
      this.register = 1;
    },

    btnShowDetail() {
      const options = { okLabel: "ตกลง" };
      if (!this.url) {
        this.$dialogs.alert("กรุณาถ่ายรูปบัตรประชาชน", options);
      } else {
        this.upLoadImgCitizen();
        this.upLoadImgBookBank();
        this.register = 3;
      }
    },

    btnBackToTakeImg() {
      this.register = 2;
    },

    handleFileUploadCitizen() {
      this.file = this.$refs.url.files[0];
      this.uploadImg = this.$refs.url.files[0];
      // console.log(this.$refs.url.files[0].name);
    },

    handleFileUploadBookBank() {
      this.fileBank = this.$refs.urlBank.files[0];
      this.uploadImg = this.$refs.urlBank.files[0];
      // console.log(this.$refs.urlBank.files[0].name);
    },

    upLoadImgCitizen() {
      let formDataCitizen = new FormData();
      formDataCitizen.append("file", this.file);
      function main() {
        return axios
          .post("https://api.945cs.work/upload_frontend", formDataCitizen, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(data => {
            return data.data;
          });
      }
      main().then(data => {
        this.imgIdCardCode = data.fileName;
        // console.log("ชื่อรุปบัตรประชาชน", this.imgIdCardCode);
        this.upLoadImgBookBank();
      });
    },

    upLoadImgBookBank() {
      let formDataBookBank = new FormData();
      formDataBookBank.append("file", this.fileBank);

      function main() {
        return axios
          .post("https://api.945cs.work/upload_frontend", formDataBookBank, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(data => {
            return data.data;
          });
      }
      main().then(data => {
        this.imgBookBank = data.fileName;
        //  console.log("ชื่อรุปหน้าบัญชี", this.imgBookBank);
        //  alert("ส่งไปเซฟ");
         this.saveRegister();
      });
    },
    onChange(event) {
      // console.log(event.target.options);
    },
 
    handleFileUploadBookBank() {
      this.fileBank = this.$refs.urlBank.files[0];
      this.uploadImg = this.$refs.urlBank.files[0];
      // console.log(this.$refs.urlBank.files[0].name);
    },
    onFileChangeBank(e) {
      const fileBank = e.target.files[0];
      this.urlBank = URL.createObjectURL(fileBank);
    },
    
  }
};
</script>

<style lang="scss" scoped>
.responsive {
  width: 100%;
  height: auto;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn-up {

  border: 2px solid #428BCA;
  color: #428BCA;
  background-color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  width: 200px;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 150px;
  height: 150px;
  margin: 30px;
  border: 6px solid skyblue;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: skyblue transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lds-ring2 {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ring2 div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 50px;
  height: 50px;
  margin: 30px;
  border: 6px solid skyblue;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: skyblue transparent transparent transparent;
}
.lds-ring2 div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring2 div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring2 div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>