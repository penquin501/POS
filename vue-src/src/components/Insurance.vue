<template>
  <div style="margin-top: 100px;">
    <div class="container">
      <section v-if="insuaranceStep == 1">
        <div class="panel panel-primary">
          <div class="panel-heading" style="text-align: center">ซื้อประกัน</div>
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-2"></div>
              <div class="col-sm-8">
                <input
                  autofocus
                  id="focusTDZ"
                  ref="focusTDZ"
                  @keyup.enter="btnNextInsuarance"
                  class="form-control"
                  v-model="insuaranceTrackingInput"
                  onKeyPress="if(this.value.length == 12) return false;"
                  placeholder="Consignment No."
                  style="margin-top: 5% ; margin-bottom: 5% ; text-transform: uppercase;"
                />
                <div style="text-align: center">
                  <b style="font-size: 20px">Example : TDZ12345678</b>
                </div>
              </div>
              <div class="col-sm-2"></div>
            </div>

            <div>
              <div class="row">
                <div class="col-sm-12" style="margin-top: 5%">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-2"></div>
                  <button class="btn btn-success col-sm-4" v-on:click="btnNextInsuarance">ตกลง</button>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="insuaranceStep == 2">
        <div class="panel panel-primary">
          <div class="panel-heading" style="text-align: center">รายละเอียด</div>
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-3">
                  <b>ชื่อสินค้า</b>
                  <span style="color:red ; font-weight:bold">&nbsp;*</span>
                </div>
                <div class="col-sm-5">
                  <input
                    class="form-control"
                    v-model="insuaranceNameInput"
                    placeholder="กรุณาระบุชื่อสินค้า"
                    id="detailInsuaranceInput"
                    maxlength="50"
                  />
                </div>
                <div class="col-sm-2"></div>
              </div>

              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-3">
                  <b>มูลค่า (บาท)</b>
                  <span style="color:red ; font-weight:bold">&nbsp;*</span>
                </div>
                <div class="col-sm-5">
                  <input
                    class="form-control"
                    v-model="insuaranceValueInput"
                    placeholder="กรุณาระบุมูลค่า"
                    id="detailInsuaranceInput"
                    maxlength="10"
                  />
                </div>
                <div class="col-sm-2"></div>
              </div>

              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-3">
                  <b>ประเภท</b>
                  <span style="color:red ; font-weight:bold">&nbsp;*</span>
                </div>
                <div class="col-sm-5">
                  <input
                    class="form-control"
                    v-model="insuaranceTypeInput"
                    placeholder="กรุณาระบุประเภท"
                    id="detailInsuaranceInput"
                    maxlength="100"
                  />
                </div>
                <div class="col-sm-2"></div>
              </div>

              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-3">
                  <b>รายละเอียดสินค้า</b>
                  <!-- <span style="color:red ; font-weight:bold">&nbsp;*</span> -->
                </div>
                <div class="col-sm-5">
                  <textarea
                    class="form-control"
                    v-model="insuaranceDetailInput"
                    placeholder="กรุณาระบุรายละเอียด"
                    id="detailInsuaranceInput"
                    maxlength="100"
                    style="resize: none;"
                  />
                </div>
                <div class="col-sm-2"></div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div
                    class="panel panel-primary"
                    style="margin-top: 5% ; margin-left: 5% ; margin-right: 1%"
                  >
                    <div
                      class="panel-heading"
                      style="text-align: center"
                    >หลักฐานเพิ่มเติม เช่น อัพโหลดรูปพัสดุ</div>
                    <div class="panel-body center">
                      <div>
                        <input
                          id="fileOne"
                          type="file"
                          accept="image/*"
                          @change="onFileChangeOne"
                          ref="imgOne"
                          v-on:change="handleFileUploadOne"
                        />
                        <label for="fileOne" class="btn-1">
                          <i class="fa fa-camera" style="font-size: 30px;" aria-hidden="true"></i>
                        </label>
                      </div>
                      <div>
                        <div
                          id="preview"
                          style="margin-left: 5% ; margin-right: 5% ; margin-bottom: 5%"
                        >
                          <img
                            v-img
                            class="responsive"
                            v-if="imgOne"
                            :src="imgOne"
                            style="margin-top: 5% ;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div
                    class="panel panel-primary"
                    style="margin-top: 5% ; margin-left: 1% ; margin-right: 5%"
                  >
                    <div
                      class="panel-heading"
                      style="text-align: center"
                    >เอกสารรับรองมูลค่า เช่น ใบเสร็จ</div>
                    <div class="panel-body center">
                      <div>
                        <input
                          id="fileTwo"
                          type="file"
                          accept="image/*"
                          @change="onFileChangeTwo"
                          ref="imgTwo"
                          v-on:change="handleFileUploadTwo"
                        />
                        <label for="fileTwo" class="btn-1">
                          <i class="fa fa-camera" style="font-size: 30px;" aria-hidden="true"></i>
                        </label>
                      </div>

                      <div>
                        <div
                          id="preview"
                          style="margin-left: 5% ; margin-right: 5% ; margin-bottom: 5%"
                        >
                          <img
                            v-img
                            class="responsive"
                            v-if="imgTwo"
                            :src="imgTwo"
                            style="margin-top: 5% ;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12" style="margin-top: 5%">
                  <div class="col-sm-1"></div>
                  <button
                    class="btn btn-warning col-sm-4"
                    v-on:click="btnBackInsuaranceToTDZ"
                  >ย้อนกลับ</button>
                  <div class="col-sm-2"></div>
                  <button
                    class="btn btn-success col-sm-4"
                    v-on:click="btnNextInsuaranceToPreview"
                  >ถัดไป</button>
                  <div class="col-sm-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="insuaranceStep == 3">
        <div class="panel panel-primary">
          <div class="panel-heading" style="text-align: center">รายละเอียด</div>
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-2">
                  <b>รายละเอียด</b>
                </div>
                <div class="col-sm-1">:</div>
                <div class="col-sm-6">{{insuaranceDetailInput}}</div>
                <div class="col-sm-1"></div>
              </div>

              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-2">
                  <b>มูลค่า</b>
                </div>
                <div class="col-sm-1">:</div>
                <div class="col-sm-6">{{insuaranceValueInput}}</div>
                <div class="col-sm-1"></div>
              </div>

              <div class="col-sm-12" style="margin-bottom: 1%">
                <div class="col-sm-2"></div>
                <div class="col-sm-2">
                  <b>ประเภท</b>
                </div>
                <div class="col-sm-1">:</div>
                <div class="col-sm-6">{{insuaranceTypeInput}}</div>
                <div class="col-sm-1"></div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div
                    class="panel panel-primary"
                    style="margin-top: 5% ; margin-left: 5% ; margin-right: 1%"
                  >
                    <div
                      class="panel-heading"
                      style="text-align: center"
                    >หลักฐานเพิ่มเติม (อัพโหลดรูปพัสดุ)</div>
                    <div class="panel-body center">
                      <div>
                        <div
                          id="preview"
                          style="margin-left: 5% ; margin-right: 5% ; margin-bottom: 5%"
                        >
                          <img
                            v-img
                            class="responsive"
                            v-if="imgOne"
                            :src="imgOne"
                            style="margin-top: 5% ;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div
                    class="panel panel-primary"
                    style="margin-top: 5% ; margin-left: 1% ; margin-right: 5%"
                  >
                    <div
                      class="panel-heading"
                      style="text-align: center"
                    >เอกสารรับรองมูลค่า (ใบเสร็จ)</div>
                    <div class="panel-body center">
                      <div>
                        <div
                          id="preview"
                          style="margin-left: 5% ; margin-right: 5% ; margin-bottom: 5%"
                        >
                          <img
                            v-img
                            class="responsive"
                            v-if="imgTwo"
                            :src="imgTwo"
                            style="margin-top: 5% ;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12" style="margin-top: 5%">
                  <div class="col-sm-1"></div>
                  <button
                    class="btn btn-warning col-sm-4"
                    v-on:click="btnBackInsuaranceToInputDetail"
                  >ย้อนกลับ</button>
                  <div class="col-sm-2"></div>
                  <button class="btn btn-success col-sm-4" v-on:click="btnInsuaranceSuccess">ยืนยัน</button>
                  <div class="col-sm-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      //page
      insuaranceStep: 1,
      insuaranceTrackingInput: "",
      insuaranceDetailInput: "",
      insuaranceValueInput: "",
      insuaranceTypeInput: "",
      insuaranceNameInput: "",

      //picture
      imgOne: "",
      imgTwo: ""
    };
  },
  methods: {
    btnNextInsuarance() {
      const options = { title: "" };
      this.btnBack = "yes";
      if (!this.insuaranceTrackingInput) {
        this.$dialogs.alert("กรุณากรอกพัสดุ", options).then(res => {
          console.log("This was logged in the callback!");
          $("#focusTDZ").val("");
          if ($("#focusTDZ").val("")) {
            $("#focusTDZ").focus();
          }
        });
      } else {
        var barcodeRE = /^[T|t][D|d][Z|z]+[0-9]{8}[A-Z]?$/i;
        if (this.insuaranceTrackingInput.match(barcodeRE)) {
          this.insuaranceStep = 2;
        } else if (!this.insuaranceTrackingInput.match(barcodeRE)) {
          this.$dialogs.alert("เลขพัสดุผิด", options).then(res => {
            $("#focusTDZ").val("");
            if ($("#focusTDZ").val("")) {
              $("#focusTDZ").focus();
            }
          });
        }
      }
    },

    onFileChangeOne(e) {
      const fileOne = e.target.files[0];
      this.imgOne = URL.createObjectURL(fileOne);
    },

    onFileChangeTwo(e) {
      const fileTwo = e.target.files[0];
      this.imgTwo = URL.createObjectURL(fileTwo);
    },

    handleFileUploadOne() {
      this.fileOne = this.$refs.imgOne.files[0];
      this.uploadImg = this.$refs.imgOne.files[0];
      console.log(this.$refs.imgOne.files[0].name);
    },

    handleFileUploadTwo() {
      this.fileTwo = this.$refs.imgTwo.files[0];
      this.uploadImg = this.$refs.imgTwo.files[0];
      console.log(this.$refs.imgTwo.files[0].name);
    },
    btnBackInsuaranceToTDZ() {
      this.insuaranceStep = 1;
      this.insuaranceTrackingInput = "";
      $(document).ready(function() {
        $("#focusTDZ").focus();
      });
    },
    btnNextInsuaranceToPreview() {
      if (!this.insuaranceNameInput) {
        this.$dialogs.alert("กรุณากรอกรายชื่อสินค้า");
      } else if (!this.insuaranceDetailInput) {
        this.$dialogs.alert("กรุณากรอกรายละเอียด");
      } else if (!this.insuaranceValueInput) {
        this.$dialogs.alert("กรุณากรอกมูลค่า");
      } else if (!this.insuaranceTypeInput) {
        this.$dialogs.alert("กรุณากรอกชนิด");
      } else if (!this.imgOne) {
        this.$dialogs.alert("ไม่มีรูปพัสดุ");
      } else if (!this.imgTwo) {
        this.$dialogs.alert("ไม่มีรูปใบเสร็จ");
      } else {
        this.insuaranceStep = 3;
      }
    },
    btnBackInsuaranceToInputDetail() {
      this.insuaranceStep = 2;
    },
    btnInsuaranceSuccess() {
      this.insuaranceStep = 4;
    }
  }
};
</script>
<style lang="scss" scoped>
.responsive {
  width: 100%;
  height: auto;
}

[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}

[type="file"] + label {
  background: #f15d22;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: "Poppins", sans-serif;
  font-size: inherit;
  font-weight: 600;
  margin-bottom: 1rem;
  outline: none;
  padding: 1rem 50px;
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;

  &:hover {
    background-color: darken(#f15d22, 10%);
  }

  &.btn-1 {
    background-color: #337ab7;
    box-shadow: 0 6px darken(#337ab7, 10%);
    transition: none;

    &:hover {
      box-shadow: 0 4px darken(#337ab7, 10%);
      top: 2px;
    }
  }
}
</style>