<template>
  <div style="margin-top: 40px;">
    <div class="container">
 
      <div class="row" v-if="view == 'createBill'">
        <div style="text-align: center">
          <h2>Status : เปิดบิลใหม่</h2>
        </div>

        <div
          class="panel panel-default"
          style="border-bottom-width: 0px;border-right-width: 0px;border-top-width: 0px;border-left-width: 0px;"
        >
     
          <div class="panel-heading" style="text-align: center;  background-color:#291e9c;">
            <span style="font-size:18px">Member : รหัสสมาชิก</span>
          </div>
          <div class="panel-body" style="text-align: center">
            <div class="col-sm-4"></div>
            <div class="col-sm-4">
             
              <input
                type="text"
                class="form-control"
                maxlength="15"
                placeholder="หมายเลขสมาชิก"
                v-model="idmember"
                v-on:keypress="onlyNumber"
                ref="memberCode"
                style="height:40px"
                />

       
            </div>
            <div class="col-sm-4"></div>
          </div>
        </div>
        <div
          class="panel panel-default"
          style="border-bottom-width: 0px;border-right-width: 0px;border-top-width: 0px;border-left-width: 0px;"
        >
          <div class="panel-heading" style="text-align: center;     background-color:#291e9c;">
            <span style="font-size:18px">Carrier : ผู้นำส่ง</span>
          </div>
          <div class="panel-body" style="text-align: center">
            <div class="row">
              <div class="col-sm-4"></div>
              <div class="col-sm-4">
                <input
                  class="form-control"
                  placeholder="หมายเลขบัตรประชาชน"
                  v-model="idCard"
                  type="text"
                  maxlength="13"
                  v-on:keypress="onlyNumber"
                  id="idCardNumber"
                  style="height:40px"
               />
              </div>
              <div class="col-sm-4"></div>
            </div>
            <div class="row">
              <div class="col-sm-4"></div>
              <div class="col-sm-4" style="margin-top: 5%">
                <div>
                  <button
                    class="btn btn-warning"
                    data-toggle="collapse"
                    data-target="#demo"
                    v-on:click="enableWebcam"
                  >อ่านภาพหน้าบัตร</button>

                  <div id="demo" class="collapse">
                    <div>
                      <div style="width: 380px;">
                        <div class="grid-row" v-if="webcamProps.allowManualFileUploads">
                          <input
                            type="file"
                            id="webcampick"
                            ref="webcampick"
                            multiple
                            @change="handleFilesUpload()"
                          />
                        </div>
                        <div class="col-sm" style="margin-top: 5%">
                          <div class="grid-element webcampick-preview">
                            <video id="video" class="webcampick-width" autoplay></video>
                            <button
                              v-if="this.btnCamera == 'true'"
                              @click="takeImage()"
                              class="make-photo-btn"
                            >
                              &nbsp;&nbsp;
                              <i class="fa fa-camera" aria-hidden="true"></i>&nbsp;&nbsp;
                            </button>
                            <canvas id="canvas" hidden></canvas>
                          </div>
                          <div
                            class="grid-element"
                            v-if="!webcamProps.webcamOnly && !webcamProps.hidePreview"
                          >
                            <div v-if="files.length">
                              <div v-if="src !== ''">
                                <img :src="src" alt class="webcampick-width" />
                              </div>
                              <div
                                v-if="webcamProps.notPictureTypeFilesPreview === '' && src === ''"
                              >
                                <p>You can not open the preview file of this format!</p>
                              </div>
                            </div>
                          </div>
                          <div class="grid-element shots-list" v-if="!webcamProps.webcamOnly">
                            <div>
                              <ul v-if="files.length">
                                <li v-for="(file, key) in files" :key="key" @click="readURL(file)">
                                  {{ file.name }}
                                  <button
                                    @click.stop="removeFile( key )"
                                    class="remove"
                                  >remove</button>
                                </li>
                              </ul>
                            </div>
                            <div
                              class="submit-container"
                              v-if="webcamProps.showSubmitButton && files.length"
                            >
                              <button @click.stop="uploadToServer()" class="submit-button">Submit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4"></div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 50px;">
          <div class="row">
            <div class="col-sm-4"></div>
            <div class="col-sm-4" style="margin-top: 5%">
              <button
                class="btn btn-success form-control"
                v-on:click="btnClickCreateBill"
                style="
    height: 49px;
"
              >ตรวจสอบ - บันทึก</button>
            </div>
            <div class="col-sm-4"></div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill2'">
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>

        <div class="row">
          <div class="col-sm-6 col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading" style="text-align:center">
                <h1 class="panel-title">
                  <b style="font-size:18px">ข้อมูลสมาชิกโดยสังเขป</b>
                </h1>
              </div>
              <div class="panel-body">
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>เลขสมาชิก</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{memberData.member_code}}</div>
                </div>

                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>ชื่อสมาชิก</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{memberData.first_name}} {{memberData.last_name}}</div>
                </div>

                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>เบอร์โทรศัพท์</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{ changePhone(memberData.phone) }}</div>
                </div>

                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>ที่อยู่</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{ memberData.address }}</div>
                </div>

                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>เลขที่บัญชี</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{memberData.bank_account_no}}</div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>ชื่อบัญชี</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{memberData.bank_acc_name}}</div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>ธนาคาร</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{memberData.bank_name}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading" style="text-align:center">
                <h1 class="panel-title">
                  <b style="font-size:18px">ผู้นำส่งพัสดุ</b>
                </h1>
              </div>
              <div class="panel-body" style="
    height: 280px;
">
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-3 col-md-3">
                    <b>เลขสมาชิก</b>
                  </div>
                  <div class="col-sm-1 col-md-1">
                    <b>:</b>
                  </div>
                  <div class="col-sm-8 col-md-8">{{ idCard }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-4"></div>
          <div class="col-sm-4" style="margin-top: 5%">
            <button class="btn btn-success btn-lg form-control btn-add" v-on:click="btnAddList">
              <img src="../assets/img/add.png" height="35px" /> &nbsp; &nbsp;ทำรายการหน้าร้าน
            </button>
            <a
              data-backdrop="static"
              data-toggle="modal"
              href="#shortModal"
              class="trigger-btn btn btn-warning btn-lg form-control btn-quick"
              v-on:click="btnQuicklink"
            >
              <img src="../assets/img/quick.png" height="35px" style=" margin-top: 12px;" /> &nbsp;ทำรายการด่วน
            </a>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill3'">
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>
        <PreventUnload :when="hasChanges" />
        <div class="row">
          <div class="col-sm-12">
            <div class="col-sm-1"></div>
            <div class="col-sm-5">
              <button
                class="btn btn-info form-control"
                v-on:click="selectTypePOS('NORMAL')"
                style="
    height: 49px;
"
              >
                <span style="font-size:16px">จัดส่งปกติ</span>
              </button>
            </div>

            <div class="col-sm-5">
              <button
                class="btn btn-success form-control"
                v-on:click="selectTypePOS('COD')"
                style="height: 49px;"
              >
                <span style="font-size:16px">เก็บเงินปลายทาง</span>
              </button>
              <input
                class="form-control"
                v-if="openInputCOD == 'open'"
                v-model="listTracking.cod_value"
                placeholder="*หมายเหตุเก็บเงินปลายทางจำนวนไม่เกิน 10,000 บาท"
                style="margin-top: 5%"
                maxlength="5"
                v-on:keypress="valueCOD"
                id="openInCOD"
                autofocus
              />
              <button
                class="btn btn-success form-control"
                v-if="openInputCOD == 'open'"
                v-on:click="selectBoxCOD"
                style="margin-top: 5%"
              >ยืนยัน</button>
            </div>

            <div class="col-sm-1"></div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="col-sm-3"></div>

            <div class="col-sm-3" style="margin-top: 5%">
              <button class="btn btn-secondary form-control" v-on:click="btnBackToCreateBill2">
                <span class="glyphicon glyphicon-arrow-left"></span> &nbsp;&nbsp;ย้อนกลับ
              </button>
            </div>

            <div class="col-sm-3" style="margin-top: 5%">
              <button
                class="btn btn-success form-control"
                v-if="this.countAll >= 1"
                v-on:click="btnBackToTable"
              >
                <span class="glyphicon glyphicon-list-alt"></span> &nbsp;&nbsp;กลับหน้าทำรายการ
              </button>
            </div>

            <div class="col-sm-3"></div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill4'">
        <PreventUnload :when="hasChanges" />
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>

        <div class="row">
          <div class="row">
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('mini')"
              >
                <span style="font-size:16px">MINI</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('miniPlus')"
              >
                <span style="font-size:16px">MINI+</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('s')"
              >
                <span style="font-size:16px">S</span>
              </button>
            </div>
          </div>
          <div class="row" style="margin-top: 2%">
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('sPlus')"
              >
                <span style="font-size:16px">S+</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('m')"
              >
                <span style="font-size:16px">M</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('mPlus')"
              >
                <span style="font-size:16px">M+</span>
              </button>
            </div>
          </div>
          <div class="row" style="margin-top: 2%">
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('l')"
              >
                <span style="font-size:16px">L</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('xl')"
              >
                <span style="font-size:16px">XL</span>
              </button>
            </div>
            <div class="col-sm-4">
              <button
                class="btn btn-success form-control"
                style="
    height: 49px;
"
                v-on:click="selectBox('xxl')"
              >
                <span style="font-size:16px">XXL</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="row">
            <div class="col-sm-4"></div>
            <div class="col-sm-4" style="margin-top: 5%">
              <button class="btn btn-secondary form-control" v-on:click="btnBackToCreateBill3">
                <span class="glyphicon glyphicon-arrow-left"></span> &nbsp;&nbsp;ย้อนกลับ
              </button>
            </div>
            <div class="col-sm-4"></div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill5'">
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>

        <div class="row">
          <div class="panel panel-default">
            <div class="panel-heading" style="text-align: center">
              <span style="font-size:18px">ที่อยู่ : ผู้รับพัสดุปลายทาง</span>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-sm-12" style="margin-bottom: 1%">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-3">
                    <b>ชื่อ</b>
                    <span style="color:red ; font-weight:bold">&nbsp;*</span>
                  </div>
                  <div class="col-sm-5">
                    <input
                      class="form-control"
                      v-on:keypress="inputCheckName"
                      v-model="listTracking.inputName"
                      placeholder="ชื่อและนามสกุล ผู้รับ"
                      maxlength="100"
                      id="receiverName"
                      autofocus
                    />
                  </div>
                  <div class="col-sm-2"></div>
                </div>

                <div class="col-sm-12" style="margin-bottom: 1%">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-3">
                    <b>เบอร์มือถือ</b>
                    <span style="color:red ; font-weight:bold">&nbsp;*</span>
                  </div>
                  <div class="col-sm-5">
                    <input
                      class="form-control"
                      v-model="listTracking.inputPhoneNumber"
                      placeholder="0899999999"
                      maxlength="10"
                      v-on:keypress="onlyNumber"
                      id="inputPhone"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                </div>

                <div class="col-sm-12" style="margin-bottom: 1%">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-3">
                    <b>รหัสไปรษณีย์</b>
                    <span style="color:red ; font-weight:bold">&nbsp;*</span>
                  </div>
                  <div class="col-sm-5">
                    <div class="searchZipCode">
                      <div v-on:click="clickOpen" v-if="openZipCode">
                        <span
                          v-if="!listTracking.address.AMPHUR_ID || !listTracking.address.zipcode "
                          style="color: #9999a3"
                        >&nbsp;&nbsp;รหัสไปรษณีย์</span>
                        &nbsp;
                        <span>{{listTracking.address.zipcode}}&nbsp;</span>
                        <span>{{listTracking.address.DISTRICT_NAME}}&nbsp;</span>
                        <span>{{listTracking.address.AMPHUR_NAME}}&nbsp;</span>
                        <span>{{listTracking.address.PROVINCE_NAME}}&nbsp;</span>
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

                  <div class="col-sm-2"></div>
                </div>

                <div class="col-sm-12" style="margin-bottom: 1%">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-3">
                    <b>ที่อยู่</b>
                    <span style="color:red ; font-weight:bold">&nbsp;*</span>
                  </div>
                  <div class="col-sm-5">
                    <input
                      class="form-control"
                      v-model="listTracking.inputAddress"
                      placeholder="ที่อยู่ ไม่เกิน 100 ตัวอักษร"
                      id="inputAddress"
                      maxlength="100"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                </div>

                <div class="col-sm-12">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-3">
                    <b>บันทึกเพิ่มเติม</b>
                  </div>
                  <div class="col-sm-5">
                    <input
                      class="form-control"
                      v-model="listTracking.inputRemark"
                      placeholder="บันทึกเพิ่มเติม ไม่เกิน 50 ตัวอักษร"
                      id="inputRemark"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-6">
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
                <button class="btn btn-secondary col-sm-4" v-on:click="btnBackToCreateBill3">
                  <span class="glyphicon glyphicon-arrow-left"></span> &nbsp;&nbsp;ย้อนกลับ
                </button>
              </div>
              <div class="col-sm-6">
                <button class="btn btn-success col-sm-4" v-on:click="acceptSend">
                  ถัดไป &nbsp;&nbsp;
                  <span class="glyphicon glyphicon-arrow-right"></span>
                </button>
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill6'">
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>

        <div class="row">
          <div class="col-sm-1"></div>
          <div class="col-sm-10">
            <div class="panel panel-default">
              <div class="panel-heading" style="text-align: center">
                <span style="font-size:18px">ยืนยันการจัดส่งข้อมูล</span>
              </div>
              <div class="panel-body">
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-2">
                    <b>การจัดส่ง</b>
                  </div>
                  <div class="col-sm-2">
                    <b>:</b>
                  </div>
                  <div class="col-sm-7">
                    <label style="font-weight: normal;">{{listTracking.parcelType}}</label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-2">
                    <b>Size</b>
                  </div>
                  <div class="col-sm-2">
                    <b>:</b>
                  </div>
                  <div class="col-sm-7">
                    <label
                      style="font-weight: normal;text-transform: uppercase;"
                    >{{listTracking.sizeBox}}</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-2">
                    <b>ผู้รับ</b>
                  </div>
                  <div class="col-sm-2">
                    <b>:</b>
                  </div>
                  <div class="col-sm-7">
                    <label style="font-weight: normal;">{{listTracking.inputName}}</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-2">
                    <b>ที่อยู่</b>
                  </div>
                  <div class="col-sm-2">
                    <b>:</b>
                  </div>
                  <div class="col-sm-7">
                    <label
                      style="font-weight: normal;"
                    >{{listTracking.inputAddress}}&nbsp;{{ dataFirstGetZipCode[0].DISTRICT_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[0].AMPHUR_NAME + '&nbsp; &nbsp;' + dataFirstGetZipCode[0].PROVINCE_NAME+ '&nbsp; &nbsp;' + dataFirstGetZipCode[0].zipcode }}</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-2">
                    <b>ข้อมูลเพิ่มเติม</b>
                  </div>
                  <div class="col-sm-2">
                    <b>:</b>
                  </div>
                  <div class="col-sm-7">
                    <label style="font-weight: normal;">{{listTracking.inputRemark}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-1"></div>
        </div>
        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-6">
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
                <button class="btn btn-danger col-sm-4" v-on:click="btnBackToCreateBill">ยกเลิก</button>
              </div>
              <div class="col-sm-6">
                <button class="btn btn-success col-sm-4" v-on:click="showTDZ">ยืนยัน</button>
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill7'">
        <div class="col-sm-12" style="margin-top: 5%">
          <div class="col-sm-3"></div>
          <div class="col-sm-6">
            <div class="panel panel-default">
              <div class="panel-heading" style="text-align: center; ">
                <span style="font-size:18px">เลขที่จัดส่ง</span>
              </div>
              <div class="panel-body" style="height: 260px">
                <input
                  id="focusTDZ"
                  ref="focusTDZ"
                  @keyup.enter="btnNextInputTDZ"
                  :disabled="state.isSending"
                  class="form-control"
                  v-model="listTracking.inputTracking"
                  onKeyPress="if(this.value.length == 12) return false;"
                  v-on:keypress="engOnly"
                  placeholder="Consignment No."
                  style="margin-top: 5% ; margin-bottom: 5% ; text-transform: uppercase;"
                />
                <div style="text-align: center">
                  <b style="font-size: 20px">Example : TDZxxxxxxxx</b>
                </div>

                <div>
                  <div class="row">
                    <div class="col-sm-12" style="margin-top: 5%">
                      <div class="col-sm-2"></div>
                      <div class="col-sm-2"></div>
                      <button
                        class="btn btn-success col-sm-4"
                        v-on:click="btnNextInputTDZ"
                        :disabled="state.isSending"
                      >ตกลง</button>
                      <div class="col-sm-2"></div>
                      <div class="col-sm-2"></div>
                    </div>
                    <div class="col-sm-12" style="margin-top: 3%">
                      <div class="col-sm-2"></div>
                      <div class="col-sm-2"></div>
                      <button
                        class="btn btn-danger col-sm-4"
                        v-on:click="btnBackToCreateBill"
                      >ยกเลิก</button>
                      <div class="col-sm-2"></div>
                      <div class="col-sm-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-3"></div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill8'">
        <div style="text-align: center">
          <h2>Status : อยู่ระหว่างขั้นตอนการทำรายการ</h2>
        </div>

        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <div
                class="col-sm-6 col-md-6"
                style="background-color:#D3D3D3; border-radius:15px;  height: 130px;"
              >
                <div class="row" style="padding-bottom: 10px; padding-top:10px">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุทั้งหมด</b>
                  </div>
                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{countAll}}</span>
                  </div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุเก็บเงินปลายทาง (COD)</b>
                  </div>

                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{countCOD}}</span>
                  </div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุจัดส่งปกติ (Normal)</b>
                  </div>
                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{countNormal}}</span>
                  </div>
                </div>
              </div>

              <div
                class="col-sm-6 col-md-6"
                style="background-color: 		rgb(138, 138, 138); border-radius:15px;  height: 130px;"
              >
                <div class="row" style="padding-bottom: 10px;text-align: right;margin-top: 30px;">
                  <div class="col-sm-4 col-md-4"></div>
                  <div class="col-sm-8 col-md-8" style="vertical-align: middle;">
                    <b style="font-size:30px; ">รวมค่าจัดส่ง&nbsp; {{totalSum}} &nbsp;บาท</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12" style="margin-top: 15px;">
              <table class="table table-striped t-table">
                <thead>
                  <tr>
                    <th scope="col" style="text-align: center ;">
                      <b style="font-size:18px">เลขจัดส่ง</b>
                    </th>
                    <th scope="col" style="text-align: center ;">
                      <b style="font-size:18px">ประเภท</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ขนาดพัสดุ</b>
                    </th>

                    <th scope="col" style="text-align: center ; ">
                      <b style="font-size:18px">มูลค่า COD</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ปลายทางจัดส่ง</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ค่าจัดส่ง</b>
                    </th>

                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ลบรายการ</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-bind:key="item.id" v-for="(item  , index ) in datalistPOS">
                    <td
                      style="text-transform: uppercase;"
                    >{{datalistPOS[index].listTracking[0].tracking}}</td>
                    <td
                      style="text-transform: uppercase;"
                    >{{datalistPOS[index].listTracking[0].parcel_type}}</td>

                    <td
                      style="text-transform: uppercase; text-align: center;"
                    >{{datalistPOS[index].listTracking[0].size_box}}</td>

                    <td
                      style="text-transform: uppercase; text-align: right;"
                    >{{datalistPOS[index].listTracking[0].cod_value}}</td>
                    <td style="text-align: center">
                      {{ datalistPOS[index].listTracking[0].address.receiver_name + '&nbsp; &nbsp;'+
                      datalistPOS[index].listTracking[0].address.province_name + '&nbsp; &nbsp;' +
                      datalistPOS[index].listTracking[0].address.zipcode }}
                    </td>
                    <td style="text-align: right">
                      <span
                        style="text-transform: uppercase;"
                      >{{datalistPOS[index].listTracking[0].size_price}} .-</span>
                    </td>

                    <td v-on:click="deleteEvent(index)" style="text-align: center">
                      <i
                        class="fa fa-trash-o"
                        aria-hidden="true"
                        style="font-size: 20px; cursor: pointer; color:red"
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-6">
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
                <button
                  class="btn btn-warning col-sm-4"
                  v-on:click="btnBackToCreateBill"
                >เพิ่มรายการ</button>
              </div>
              <div class="col-sm-6">
                <button
                  href="#myModal"
                  class="btn btn-success col-sm-4"
                  v-on:click="successCreateBill"
                  v-if="countAll != 0"
                >บันทึกรายการ</button>
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="view == 'createBill9'">
        <div style="text-align: center">
          <h2>Status : เสร็จสิ้น</h2>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div
              class="col-sm-6 col-md-6"
              style="background-color:#D3D3D3; border-radius:15px;  height: 130px;"
            >
              <div class="row" style="padding-bottom: 10px; padding-top:10px">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุทั้งหมด</b>
                </div>
                <div class="col-sm-6 col-md-6" style="text-align:right">
                  <span style="font-size:22px">{{countAll}}</span>
                </div>
              </div>
              <div class="row" style="padding-bottom: 10px;">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุเก็บเงินปลายทาง (COD)</b>
                </div>

                <div class="col-sm-6 col-md-6" style="text-align:right">
                  <span style="font-size:22px">{{countCOD}}</span>
                </div>
              </div>
              <div class="row" style="padding-bottom: 10px;">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุจัดส่งปกติ (Normal)</b>
                </div>
                <div class="col-sm-6 col-md-6" style="text-align:right">
                  <span style="font-size:22px">{{countNormal}}</span>
                </div>
              </div>
            </div>

            <div
              class="col-sm-6 col-md-6"
              style="background-color: 		rgb(138, 138, 138); border-radius:15px;  height: 130px;"
            >
              <div class="row" style="padding-bottom: 10px;text-align: right;margin-top: 30px;">
                <div class="col-sm-4 col-md-4"></div>
                <div class="col-sm-8 col-md-8" style="vertical-align: middle;">
                  <b style="font-size:30px; ">รวมค่าจัดส่ง&nbsp; {{totalSum}} &nbsp;บาท</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div
            style="text-align: center ; margin-top: 15px; font-weight: bold; font-size: 20px; margin-bottom: 15px;"
          >
            <b>เลขที่บิลใบเสร็จ : {{billNo}}</b>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">
                  <b style="font-size:18px; text-align: center;">เลขที่จัดส่ง</b>
                </th>
                <th scope="col">
                  <b style="font-size:18px; text-align: center;">ประเภท</b>
                </th>
                <th scope="col" style="text-align: center">
                  <b style="font-size:18px">ขนาดพัสดุ</b>
                </th>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">มูลค่า COD</b>
                </th>
                <th scope="col" style="text-align: center">
                  <b style="font-size:18px">ปลายทางจัดส่ง</b>
                </th>
                <th scope="col" style="text-align: center">
                  <b style="font-size:18px">ค่าจัดส่ง</b>
                </th>
                <th scope="col" style="text-align: center">
                  <b style="font-size:18px">สถานะ</b>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-bind:key="item.id" v-for="(item  , index ) in datalistPOS">
                <td
                  style="text-transform: uppercase; text-align:center;"
                >{{datalistPOS[index].listTracking[0].tracking}}</td>
                <td
                  style="text-transform: uppercase;"
                >{{datalistPOS[index].listTracking[0].parcel_type}}</td>
                <td
                  style="text-transform: uppercase; text-align: center;"
                >{{datalistPOS[index].listTracking[0].size_box}}</td>
                <td
                  style="text-transform: uppercase; text-align: right;"
                >{{datalistPOS[index].listTracking[0].cod_value}}</td>
                <td style="text-align: center">
                  {{ datalistPOS[index].listTracking[0].address.receiver_name + '&nbsp; &nbsp;'+
                  datalistPOS[index].listTracking[0].address.province_name + '&nbsp; &nbsp;' +
                  datalistPOS[index].listTracking[0].address.zipcode }}
                </td>
                <td style="text-align: right">
                  <span
                    style="text-transform: uppercase;"
                  >{{datalistPOS[index].listTracking[0].size_price}} .-</span>
                </td>

                <td style="text-align: center">
                  <i
                    class="fa fa-check-circle"
                    aria-hidden="true"
                    style="font-size: 20px; color: green ; "
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-4"></div>
              <button class="btn btn-success col-sm-4" v-on:click="print()">พิมพ์ใบเสร็จ</button>
              <div class="col-sm-4"></div>
            </div>
          </div>
        </div>
      </div>

      <section v-if="view == 'quickLinkDataExpress'">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <div
                class="col-sm-6 col-md-6"
                style="background-color:#D3D3D3; border-radius:15px;  height: 130px;"
              >
                <div class="row" style="padding-bottom: 10px; padding-top:10px">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุทั้งหมด</b>
                  </div>
                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{quickLinkCountAll}}</span>
                  </div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุเก็บเงินปลายทาง (COD)</b>
                  </div>

                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{quickLinkCountCOD}}</span>
                  </div>
                </div>
                <div class="row" style="padding-bottom: 10px;">
                  <div class="col-sm-6 col-md-6">
                    <b style="font-size:18px;">พัสดุจัดส่งปกติ (Normal)</b>
                  </div>
                  <div class="col-sm-6 col-md-6" style="text-align:right">
                    <span style="font-size:22px">{{quickLinkCountNormal}}</span>
                  </div>
                </div>
              </div>

              <div
                class="col-sm-6 col-md-6"
                style="background-color: 		rgb(138, 138, 138); border-radius:15px;  height: 130px;"
              >
                <div class="row" style="padding-bottom: 10px;text-align: right;margin-top: 30px;">
                  <div class="col-sm-4 col-md-4"></div>
                  <div class="col-sm-8 col-md-8" style="vertical-align: middle;">
                    <b style="font-size:30px; ">รวมค่าจัดส่ง&nbsp; {{quickLinkTotalSum}} &nbsp;บาท</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12" style="margin-top: 15px;">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col" style="text-align: center ;">
                      <b style="font-size:18px">เลขจัดส่ง</b>
                    </th>
                    <th scope="col" style="text-align: center ;">
                      <b style="font-size:18px">ประเภท</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ขนาดพัสดุ</b>
                    </th>
                    <th scope="col" style="text-align: center ; ">
                      <b style="font-size:18px">มูลค่า COD</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ปลายทางจัดส่ง</b>
                    </th>
                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ค่าจัดส่ง</b>
                    </th>

                    <th scope="col" style="text-align: center">
                      <b style="font-size:18px">ลบรายการ</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in quickLinkAddData" :key="item.id">
                    <td
                      style="font-size:16px; text-transform: uppercase; text-align: center; "
                    >{{ quickLinkAddData[index].tracking }}</td>
                    <td
                      style="font-size:16px; text-transform: uppercase; text-align: center; "
                    >{{ quickLinkAddData[index].parcel_type }}</td>
                    <td
                      style="font-size:16px; text-align: center; text-transform: uppercase;"
                    >{{ quickLinkAddData[index].select_size }}</td>
                    <td
                      style="font-size:16px; text-align:right;"
                    >{{ quickLinkAddData[index].cod_value }}.00</td>
                    <td
                      style="font-size:16px; text-align: center;"
                    >{{ quickLinkAddData[index].province_name }} {{ quickLinkAddData[index].zipcode }}</td>

                    <td
                      style="font-size:16px; text-align:right;"
                    >{{ quickLinkAddData[index].size_price }} .-</td>
                    <td v-on:click="removeRow(index)" style="text-align: center">
                      <i
                        class="fa fa-trash-o"
                        aria-hidden="true"
                        style="font-size: 20px; cursor: pointer; color:red"
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-6">
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
                <a
                  data-backdrop="static"
                  data-toggle="modal"
                  href="#shortModal"
                  class="trigger-btn btn btn-warning col-sm-4"
                >ทำรายการด่วน</a>
              </div>
              <div class="col-sm-6">
                <button
                  type="button"
                  v-on:click="insertQuiklink"
                  class="trigger-btn btn btn-success col-sm-4"
                  data-toggle="modal"
                >บันทึกรายการ</button>
                <div class="col-sm-4"></div>
                <div class="col-sm-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="view == 'quickLinkDataPrint'">
        <div style="text-align: center">
          <h2>Status : เสร็จสิ้น</h2>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div
              class="col-sm-6 col-md-6"
              style="background-color:#D3D3D3; border-radius:15px;  height: 130px;"
            >
              <div class="row" style="padding-bottom: 10px; padding-top:10px">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุทั้งหมด</b>
                </div>
                <div class="col-sm-6 col-md-6" style="text-align:right">{{quickLinkCountAll}}</div>
              </div>
              <div class="row" style="padding-bottom: 10px;">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุเก็บเงินปลายทาง (COD)</b>
                </div>

                <div class="col-sm-6 col-md-6" style="text-align:right">{{quickLinkCountCOD}}</div>
              </div>
              <div class="row" style="padding-bottom: 10px;">
                <div class="col-sm-6 col-md-6">
                  <b style="font-size:18px;">พัสดุจัดส่งปกติ (Normal)</b>
                </div>
                <div class="col-sm-6 col-md-6" style="text-align:right">{{quickLinkCountNormal}}</div>
              </div>
            </div>

            <div
              class="col-sm-6 col-md-6"
              style="background-color: 		rgb(138, 138, 138); border-radius:15px;  height: 130px;"
            >
              <div class="row" style="padding-bottom: 10px;text-align: right;margin-top: 30px;">
                <div class="col-sm-4 col-md-4"></div>
                <div class="col-sm-8 col-md-8" style="vertical-align: middle;">
                  <b style="font-size:30px; ">รวมค่าจัดส่ง&nbsp; {{quickLinkTotalSum}} &nbsp;บาท</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div
            style="text-align: center ; margin-top: 15px; font-weight: bold; font-size: 20px; margin-bottom: 15px;"
          >
            <b>เลขที่บิลใบเสร็จ : {{quickLinkBillingNo}}</b>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">เลขที่จัดส่ง</b>
                </th>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">ประเภทการจัดส่ง</b>
                </th>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">ขนาดพัสดุ</b>
                </th>

                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">มูลค่า COD</b>
                </th>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">ปลายทางจัดส่ง</b>
                </th>

                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">ค่าจัดส่ง</b>
                </th>
                <th scope="col" style="text-align: center;">
                  <b style="font-size:18px">สถานะ</b>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in quickLinkAddData" :key="item.id">
                <td
                  style="text-align: center; text-transform: uppercase;"
                >{{ quickLinkAddData[index].tracking }}</td>
                <td
                  style="text-align: center; text-transform: uppercase;"
                >{{ quickLinkAddData[index].parcel_type }}</td>
                <td
                  style="text-align: center; text-transform: uppercase;"
                >{{ quickLinkAddData[index].select_size }}</td>
                <td style="text-align: right;">{{ quickLinkAddData[index].cod_value }}.00</td>
                <td
                  style="text-align: center;"
                >{{quickLinkAddData[index].province_name }} {{ quickLinkAddData[index].zipcode }}</td>

                <td style="text-align: right;">{{ quickLinkAddData[index].size_price }} .-</td>
                <td style="text-align: center;">
                  <img src="../assets/img/checked.png" height="20px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-4"></div>
              <button
                type="button"
                v-on:click="printQuicklink()"
                class="btn btn-success col-sm-4"
              >พิมพ์ใบเสร็จ</button>
              <div class="col-sm-4"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal HTML -->
      <div id="myModal" class="modal fade">
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header">
              <div class="icon-box">
                <img
                  src="../assets/img/checked-symbol.png"
                  height="35px"
                  style=" margin-top: 15px;"
                />
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

      <div id="shortModal" class="modal modal-wide fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header modalHeader" style="text-align:center;">
              <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <b style="font-size:38px;  color: #FFFFFF;">ทำรายการด่วน</b>
                </div>
                <div class="col-sm-4" style="text-align:right !important;">
                  <button data-dismiss="modal" type="button" class="btn btn-danger">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body" style=" overflow-x: auto;">
              <div class="row">
                <div class="col-sm-6">
                  <div class="col-sm-5">
                    <div
                      class="panelborder panel-default"
                      v-show="quickLinkBarcode"
                    >
                      <div class="panel-heading panelHeader" style=" text-align:center">
                        <b style="font-size: 24px;">เลขที่จัดส่ง</b>
                      </div>
                      <div class="panel-body">
                        <input
                          autofocus
                          type="text"
                          ref="barcode"
                          class="form-control input-tracking"
                          onKeyPress="if(this.value.length==12) return false;"
                          v-on:keypress="engOnly"
                          @keyup.enter="checkQuickLinkTracking"
                          v-model="quickLinkTracking"
                          placeholder="TDZxxxxxxxx"
                          id="trackingfocus"
                          v-bind:readonly="is_track_readonly"
                        />
                      </div>
                    </div>
                    <div
                      class="panelborder panel-default"
                      v-show="quickLinkZipcode"
                    >
                      <div class="panel-heading panelHeader" style=" text-align:center">
                        <b style="font-size: 24px;">รหัสไปรษณีย์</b>
                      </div>
                      <div class="panel-body">
                        <input
                          type="number"
                          ref="quickLinkZipcode"
                          class="form-control"
                          maxlength="5"
                          @keyup.enter="addquickLinkZipcode"
                          onKeyPress="if(this.value.length==5) return false;"
                          v-model="qlZipcode"
                          placeholder="รหัสไปรษณีย์"
                          id="zCode"
                          style="height: 48.979166px;"
                          v-bind:readonly="is_readonly"
                        />
                        <p
                          style="font-size: 20px; color: green;  text-align:center"
                        >{{ this.quickLinkProvince1 }}</p>
                        <p
                          style="font-size: 20px; color: green;  text-align:center"
                        >{{ this.quickLinkProvince2 }}</p>
                      </div>
                    </div>


                  </div>
                  <div class="col-sm-7">
                    <div
                      class="panelborder panel-default"
                      v-show="quickLinkTransport"
                    >
                      <div class="panel-heading panelHeader" style=" text-align:center">
                        <b style="font-size: 24px;">การจัดส่ง</b>
                      </div>
                      <div class="panel-body">
                        <div class="row">
                          <div class="col-sm-6">
                            <button
                              type="button"
                              class="btn btn-primary btn-lg btn-block btn-normal"
                              v-on:click="selectTypeQuicklink('NORMAL')"
                            >
                              <img src="../assets/img/email.png" height="26px" />
                              <p style="margin-top: 0px;">NORMAL</p>
                            </button>
                          </div>
                          <div class="col-sm-6">
                            <button
                              style="height: 51px;padding-top: 2px;"
                              type="button"
                              class="btn btn-success btn-lg btn-block btn-cod"
                              v-on:click="selectTypeQuicklink('COD')"
                              :disabled="isSendingTypeQuicklink"
                            >
                              <img src="../assets/img/hand.png" height="26px" />
                              <p style="margin-top: 0px;margin-bottom: 0px;">COD</p>
                            </button>
                            <input
                              type="number"
                              ref="inputcod"
                              class="form-control"
                              @keyup.enter="addquickLinkSize"
                               maxlength="5"
                               onKeyPress="if(this.value.length==5) return false;"
                              @keypress="isNumber($event)"
                              v-model="quickLinkCodValue"
                              v-show="quickLinkInputCod"
                              placeholder="ยอด COD"
                              id="quickLinkInputCOD"
                              v-bind:readonly="is_cod_readonly"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="panelborder panel-default" v-show="quickLinkProduct">
                      <div class="panel-heading panelHeader" style=" text-align:center">
                        <b style="font-size: 22px; ">ขนาดพัสดุ</b>
                      </div>
                      <div class="panel-body">
                        <div class="row">
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('mini')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >MINI</button>
                          </div>

                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('miniPlus')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >MINI+</button>
                          </div>
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('s')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >S</button>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('sPlus')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >S+</button>
                          </div>
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('m')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >M</button>
                          </div>
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('mPlus')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >M+</button>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('l')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >L</button>
                          </div>
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('xl')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                            >XL</button>
                          </div>
                          <div class="col-sm-4">
                            <button
                              type="button"
                              v-on:click="quicklinkSizeBox('xxl')"
                              class="btn btn-warning btn-lg btn-block btn-size"
                              style="padding-left: 5px;"
                            >XXL</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                  <div class="col-sm-12">
                    <div class="col-sm-5" style="
                      padding-left: 0px;">
                      <button
                        v-show="quickLinkBtnRe"
                        v-on:click="resetQuicklink"
                        type="button"
                        class="btn btn-danger btn-lg btn-block"
                        :disabled="state.isSending"
                      >
                        <span style="font-size:20px; ">รีเซ็ทค่าเริ่มต้น</span>
                      </button>
                    </div>

                    <div class="col-sm-7" style="padding-right: 0px;">
                      <button
                        v-show="quickLinkBtnAdd"
                        v-on:click="checkValidation"
                        type="button"
                        class="btn btn-info btn-lg btn-block"
                        :disabled="state.isSending"
                      >
                        <span style="font-size:20px;">เพิ่ม</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ตาราง -->
                <div class="col-sm-6">
                  <div style="text-align: right">
                    <label style="font-size:20px;">จำนวนรายการ</label>
                    <b style="font-size:28px;">&nbsp;{{ this.quickLinkCountAll}}</b>
                    <label style="font-size:20px;">&nbsp;ชิ้น</label>
                  </div>
                  <div style="height: 350px; overflow: auto;">
                    <table class="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th scope="col" style="text-align:center; font-size:16px;">เลขที่จัดส่ง</th>
                          <th scope="col" style="text-align:center; font-size:16px;">รหัสไปรษณีย์</th>
                          <th scope="col" style="text-align:center; font-size:16px;">การจัดส่ง</th>
                          <th scope="col" style="text-align:center; font-size:16px;">มูลค่า COD</th>
                          <th scope="col" style="text-align:center; font-size:16px;">ขนาดพัสดุ</th>
                        </tr>
                      </thead>
                      <tbody style=" height:50px;overflow-y:scroll;">
                        <tr v-for="item in reverseItems" :key="item.id">
                          <td
                            style="font-size:14px; text-transform: uppercase; text-align:center;"
                          >{{ item.tracking }}</td>
                          <td
                            style="font-size:14px;"
                          >{{ item.province_name }} {{ item.zipcode }}</td>
                          <td
                            style="font-size:14px; text-transform: uppercase;text-align:center;"
                          >{{ item.parcel_type }}</td>

                          <td style="text-align:right;">{{ item.cod_value }}.00</td>

                          <td
                            style="font-size:14px; text-transform: uppercase;text-align:center;"
                          >{{ item.select_size }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div class="col-md-8"></div>
              <div class="col-md-2"></div>
              <div class="col-md-2">
                <button
                  v-on:click="quickLinkAddDataInTable"
                  type="button"
                  class="btn btn-success btn-lg form-control"
                  data-dismiss="modal"
                  style="margin-bottom: 0px;border-bottom-width: 0px;padding-bottom: 0px;padding-top: 0px;height: 50.989583px;"
                >ตกลง</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="modal modal-wide fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header modalHeader" style="text-align:center;">
            <b style="font-size:38px;  color: #FFFFFF;">คำนวนขนาด</b>
          </div>
          <div class="modal-body">
            <b>gggg</b>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>-->

    <!-- The modal -->
    <div
      id="confirmModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalLabelSmall"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="modalLabelSmall">ต้องการทำรายการต่อหรือไม่</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-6">
                <button
                  v-on:click="nextBill"
                  type="button"
                  class="btn btn-success form-control"
                  data-dismiss="modal"
                >ต้องการทำต่อ</button>
              </div>
              <div class="col-sm-6">
                <button
                  v-on:click="notNextBill"
                  type="button"
                  class="btn btn-danger form-control"
                >ไม่</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <sweet-modal icon="success" ref="successavebill">บันทึกรายการสำเร็จ</sweet-modal>
        <sweet-modal icon="error" ref="errorsavebill">ไม่สามารถบันทึกรายการได้ กรุณาตรวจสอบข้อมูลอีกครั้ง</sweet-modal>
  </div>
</template>



<script>
import Vue from "vue";
const axios = require("axios");
import "v-slim-dialog/dist/v-slim-dialog.css";
import SlimDialog from "v-slim-dialog";
import PreventUnload from "vue-prevent-unload";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
// Vue.component("vue-prevent-unload", PreventUnload);
Vue.use(PreventUnload);

Vue.use(SlimDialog);
export default {
  components: {
    PreventUnload,
    SweetModal
  },
  props: ["value"],
  data: function() {
    return {
      btnDisable: false,
      hasChanges: true,
      quickLinkPrintBill: false,
      quickLinkDataExpress: false,
      quickLinkDataDetail: false,
      quickLinkCreatebill: true,
      quickLinkBarcode: true,
      quickLinkZipcode: false,
      quickLinkTransport: false,
      quickLinkProduct: false,
      quickLinkBtnAdd: false,
      quickLinkBtnRe: false,
      quickLinkInputCod: false,
      quickLinkShowModal: false,
      quickLinkDataPrint: false,
      quickLinkTracking: "",
      quickLinkTextPhone: "",
      qlZipcode: "",
      quickLinkTypeTransport: "",
      quickLinkCodValue: "",
      quickLinkSelectSize: "",
      quickLinkSizePrice: "",
      quickLinkSizeId: "",
      quickLinkTotal: "",
      quickLinkBillingNo: "",
      quickLinkCountAll: 0,
      quickLinkCountCOD: 0,
      quickLinkCountNormal: 0,
      quickLinkCountAllinTable: 0,
      quickLinkAddData: [],
      quickLinkDataHeadBill: [],
      quickLinkDataFooterBill: [],
      quickLinkDataFullName: "",
      quickLinkDataMember: "",
      quickLinkBranchId: "",
      quickLinkRunNum: 0,
      quickLinkProvince1: "",
      quickLinkProvince2: "",
      quickLinkdataCount: [],
      quickLinkfinalObject: [],
      dataSaveQuickLink: {
        items: []
      },
      state: {
        isSending: false
      },
      isSendingTypeQuicklink: false,
      is_readonly: false,
      is_track_readonly: false,
      is_cod_readonly: false,
      dataphone: "",
      dataaddress: "",
      //page
      view: "createBill",
      openInputCOD: "false",
      btnNextCOD: "false",
      // data
      newbillKeyData: [],
      memberData: [],
      dataCount: [],
      memberCode: "",
      memberFullName: "",
      memberPhone: "",
      memberAddress: "",
      dataFullName: "",
      finalData: [],
      datalistPOS: [],
      finalObject: [],
      finalDataSave: {
        listTracking: []
      },

      countAll: 0,
      countCOD: 0,
      countNormal: 0,

      checkSizePrice: "",
      checkSizeID: "",
      checkPhoneNumber: "",

      fileNameUpload: "",

      idCard: "",

      // v-model input
      idmember: "",

      ////////////////////////////////////////////////////////////////
      member_code: "",
      carrier_id: "",
      total: 0,
      listTracking: {
        tracking: "",
        size_id: "",
        size_price: "",
        parcel_type: "",
        cod_value: 0,
        address: {
          receiver_name: "",
          phone: "",
          receiver_address: "",
          district_id: "",
          district_name: "",
          amphur_id: "",
          amphur_name: "",
          province_id: "",
          province_name: "",
          zipcode: "",
          remark: ""
        }
      },

      /////////////////////////////////////////////////////////////////

      //searchZipcode
      openZipCode: true,
      dataFirstGetZipCode: [],
      dataNewGetZipCode: [],
      selectZipCode: "",
      inputNewGetZipCode: "",
      billNo: "",

      btnBack: "",

      files: [],
      properties: null,
      showCam: true,
      canvas: null,
      context: null,
      video: null,
      defaultFilename: "picture",
      constraints: {
        video: true
      },
      src: "",
      defaultHeaders: {
        Accept: "application/json"
      },
      webcamProps: {
        pictureWidth: 400,
        pictureHeight: 100,
        autoUpload: false,
        hidePreview: false,
        showSubmitButton: false,
        notPictureTypeFilesPreview: "",
        // allowManualFileUploads: true,
        webcamOnly: false
      },
      baseSixFour: "",
      btnCamera: "true",
      merid: "",
      userid: ""
    };
  },
  created: function() {
    this.$parent.$on("sendData", () => {
      return this.uploadToServer();
    });
  },

  // ready: function() {
  //   console.log("ready");
  //   window.addEventListener("beforeunload", this.leaving);
  //   // window.beforeunload = this.leaving;
  //   // window.onblur = this.leaving;
  //   //window.onmouseout = this.leaving;
  // },

  watch: {
    idmember(){
       var num = /^\s+$/;
       var reg = new RegExp('^\\d+$');
      //  console.log(reg.test(this.idCard));
       if(!reg.test(this.idmember)) {
         alert("กรุณากรอกให้ถูกต้อง");
         this.idmember = "";
       }
      this.idmember = this.idmember.replace(/\s+/g, '');
      // console.log('card => ', this.idCard);
    },
    idCard() {
       var num = /^\s+$/;
       var reg = new RegExp('^\\d+$');
      //  console.log(reg.test(this.idCard));
       if(!reg.test(this.idCard)) {
         alert("กรุณากรอกให้ถูกต้อง");
         this.idCard = "";
       }
      this.idCard = this.idCard.replace(/\s+/g, '');
      // console.log('card => ', this.idCard);
    },
    quickLinkZipcode(vShowQuickLinkZipcode) {
      if (vShowQuickLinkZipcode == true) {
        // $(document).ready(function() {
        //   $("#zCode").focus();
        // });
        this.$refs.quickLinkZipcode.focus();
      }
    }
  },

  mounted: function() {
    var databill = this.$cookie.get("billNo");
    var databillQuickLink = this.$cookie.get("quickLinkBillingNo");
    // console.log("DATABILL", databill);
    if (databill) {
      // alert("มีเลขบิลPOS");
      this.billNo = databill;
      this.dataCount = JSON.parse(localStorage.getItem("dataCount"));
      var array = this.dataCount;
      var lastCountData = array[array.length - 1];
      this.countCOD = lastCountData.count_cod;
      this.countNormal = lastCountData.count_normal;
      this.countAll = lastCountData.count_all;
      this.finalDataSave = JSON.parse(localStorage.getItem("finalDataSave"));
      this.datalistPOS = JSON.parse(localStorage.getItem("datalistPOS"));
      this.view = "createBill9";
    } else if (databillQuickLink) {
      this.quickLinkBillingNo = databillQuickLink;
      // alert("มีเลขบิลQucikLink");
      this.quickLinkAddData = JSON.parse(
        localStorage.getItem("quickLinkAddData")
      );
      this.quickLinkdataCount = JSON.parse(
        localStorage.getItem("quickLinkdataCount")
      );

      var array = this.quickLinkdataCount;
      var lastCountData = array[array.length - 1];
      this.quickLinkCountCOD = lastCountData.quickcount_cod;
      this.quickLinkCountNormal = lastCountData.quickcount_normal;
      this.quickLinkCountAll = lastCountData.quickcount_all;

      this.quickLinkCountAllinTable = localStorage.getItem(
        "quickLinkCountAllinTable"
      );

      // console.log("Dataที่ดึงออกมา", this.quickLinkdataCount);
      // console.log("จำนวนในตาราง", this.quickLinkCountAllinTable);
      this.newbillkeydata = JSON.parse(localStorage.getItem("newbillkeydata"));
      this.memberData = JSON.parse(localStorage.getItem("memberData"));
      this.idCard = this.newbillkeydata[1];

      this.view = "quickLinkDataPrint";
    } else if (
      JSON.parse(localStorage.getItem("newbillkeydata")) != null &&
      JSON.parse(localStorage.getItem("memberData")) != null &&
      JSON.parse(localStorage.getItem("quickLinkAddData")) == null &&
      JSON.parse(localStorage.getItem("datalistPOS")) == null &&
      JSON.parse(localStorage.getItem("finalDataSave")) == null
    ) {
      // alert(
      //   "มีnewbillkeydata memberData สร้างบิลผู้ส่งเดิม ยังไม่เลือกทำรายการและรีเฟชร"
      // );
      this.newbillkeydata = JSON.parse(localStorage.getItem("newbillkeydata"));
      this.idCard = this.newbillkeydata[1];
      this.memberData = JSON.parse(localStorage.getItem("memberData"));
      this.view = "createBill2";
    } else if (
      JSON.parse(localStorage.getItem("newbillkeydata")) != null &&
      JSON.parse(localStorage.getItem("memberData")) != null &&
      JSON.parse(localStorage.getItem("quickLinkAddData")) != null &&
      JSON.parse(localStorage.getItem("quickLinkdataCount")) != null
    ) {
      // alert("มีnewbillkeydata --มี quickLinkAddData-- ไม่มีdatalistPOS ");
      //ดึงข้อมูลออกมา
      this.quickLinkAddData = JSON.parse(
        localStorage.getItem("quickLinkAddData")
      );
      this.quickLinkdataCount = JSON.parse(
        localStorage.getItem("quickLinkdataCount")
      );

      var array = this.quickLinkdataCount;
      var lastCountData = array[array.length - 1];
      this.quickLinkCountCOD = lastCountData.quickcount_cod;
      this.quickLinkCountNormal = lastCountData.quickcount_normal;
      this.quickLinkCountAll = lastCountData.quickcount_all;

      this.quickLinkCountAllinTable = localStorage.getItem(
        "quickLinkCountAllinTable"
      );

      // console.log("Dataที่ดึงออกมา", this.quickLinkdataCount);
      // console.log("จำนวนในตาราง", this.quickLinkCountAllinTable);
      this.newbillkeydata = JSON.parse(localStorage.getItem("newbillkeydata"));
      this.memberData = JSON.parse(localStorage.getItem("memberData"));
      this.idCard = this.newbillkeydata[1];
      // quickLinkDataExpress = true;
      this.view = "quickLinkDataExpress";
      // $("#shortModal").modal();
    } else if (
      JSON.parse(localStorage.getItem("newbillkeydata")) != null &&
      JSON.parse(localStorage.getItem("memberData")) != null &&
      JSON.parse(localStorage.getItem("datalistPOS")) != null &&
      JSON.parse(localStorage.getItem("finalDataSave")) != null &&
      JSON.parse(localStorage.getItem("dataCount")) != null
    ) {
      // alert(
      //   "มีnewbillkeydata --มี datalistPOS-- มี finalDataSave ไม่มีquickLinkAddData"
      // );
      var that = this;
      that.idCard = that.$cookie.get("carrierId");
      // เพิ่ม finalObject ใน finalDataSave
      var lib2 = JSON.parse(localStorage.getItem("finalDataSave"));
      that.finalObject = lib2.listTracking;
      //เพิ่มใน Datacount
      that.dataCount = JSON.parse(localStorage.getItem("dataCount"));
      var array = that.dataCount;
      var lastCountData = array[array.length - 1];
      that.countCOD = lastCountData.count_cod;
      that.countNormal = lastCountData.count_normal;
      that.countAll = lastCountData.count_all;
      // คงค่าตัวเดิม datalistPOS,finalDataSave
      that.datalistPOS = JSON.parse(localStorage.getItem("datalistPOS"));
      that.finalDataSave = JSON.parse(localStorage.getItem("finalDataSave"));
      //เพิ่มใน memberData
      that.memberData = JSON.parse(localStorage.getItem("memberData"));
      that.memberCode = that.memberData.member_code;
      that.memberFullName =
        that.memberData.first_name + " " + that.memberData.last_name;
      that.memberPhone = that.memberData.phone;
      var phone = that.memberPhone;
      if (phone[0] + phone[1] == "66") {
        that.memberPhone = this.changeDoubleSix(phone);
      } else {
        that.memberPhone = phone;
      }
      that.memberAddress = that.memberData.address;
      // console.log(that.memberFullName, that.memberPhone, that.memberAddress);
      that.view = "createBill8";
    } else if (
      JSON.parse(localStorage.getItem("newbillkeydata")) == null &&
      JSON.parse(localStorage.getItem("datalistPOS")) == null
    ) {
      // alert("ไม่มีnewbillkeydata datalistPOS");
    }

    this.webcamProps = Object.assign(this.webcamProps, this.webcamProperties);
    this.$refs.memberCode.focus();
  },

  methods: {
    onlyNumberKey($event){
      var number = /[0-9]/;
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault();
      }
      if (number.test(key)) return true;

    },
    handler: function handler(event) {
      // console.log("ddddddeeee");
    },
    showquickLinkDataDetail() {
      this.quickLinkCreatebill = false;
      this.quickLinkDataDetail = true;
    },
    checkQuickLinkTracking(quickLinkTracking) {
      console.log("เข้าฟังก์ชั่น");
      this.is_readonly = false;
      if (!this.quickLinkTracking) {
        alert("กรุณากรอกเลข Tracking");
        this.is_track_readonly = false;
      }
      this.quickLinkDataDetail = false;
      var quickLinkTrackingKey = this.quickLinkTracking.toUpperCase();
      var tracking = this.quickLinkAddData;
      // this.$refs.quickLinkZipcode.focus();
      
      var quickLinkBarcodeReg = /^[T|t][D|d][Z|z]+[0-9]{8}[A-Z]?$/i;
      if (quickLinkTrackingKey.match(quickLinkBarcodeReg) === null) {
        alert("กรุณากรอกเลขที่จัดส่ง ให้ถูกต้อง");
        this.quickLinkTracking = "";
        this.is_track_readonly = false;
        return false;
      } else if (tracking.length == 0) {
        this.checkQuickLinkTrackingApi(
          this.quickLinkTextPhone,
          quickLinkTrackingKey
        );
        return true;
      } else if (tracking.length > 0) {
        const result = tracking.filter(v => {
          return v.tracking == quickLinkTrackingKey;
        }).length;
        if (result >= 1) {
          alert("ไม่สามารถใช้เลขที่จัดส่งนี้ได้, เลขจัดส่งถูกใช้งานไปแล้ว");
          this.quickLinkZipcode = false;
          this.quickLinkTracking = "";
          this.$refs.barcode.focus();
          this.is_track_readonly = false;
          return false;
        } else {
          this.checkQuickLinkTrackingApi(
            this.quickLinkTextPhone,
            quickLinkTrackingKey
          );
          return true;
        }
      }
    },
    checkQuickLinkTrackingApi(phone, tracking) {
      var quickLinkTrackingKey = this.quickLinkTracking.toUpperCase();
      //ดึงmemberData ขึ้นมาเอาเบอร์โทร
      this.memberData = JSON.parse(localStorage.getItem("memberData"));
      this.memberPhone = this.memberData.phone;
      var phone = this.memberPhone;
      if (phone[0] + phone[1] == "66") {
        this.memberPhone = this.changeDoubleSix(phone);
      } else {
        this.memberPhone = phone;
      }
      this.quickLinkDataDetail = false;
      console.log("เลข Tracking ก่อนยิง",this.memberPhone , quickLinkTrackingKey);
      axios
        .get(
          "https://pos.945.report/genBillNo/checkSendermember?phone=" +
            // "http://206.189.85.185:8100/genBillNo/checkSendermember?phone=" +
            this.memberPhone +
            "&tracking=" +
            quickLinkTrackingKey
        )
        .then(response => {
          console.log("เลข Tracking หลังยิง",this.memberPhone , quickLinkTrackingKey);
          console.log("---StatusQucklink  1---", response.data);
          console.log("---StatusQucklink  1111---", response);
          console.log("---StatusQucklink   2---", response.data.status);
          if (response.data.status == "Error_Not_In_Capture_Data") {
            alert(
              "ไม่สามารถใช้ Tracking นี้ได้,เนื่องจาก ยังไม่ได้ทำถ่ายรูปหน้ากล่องเข้ามาในระบบ"
            );
            this.quickLinkTracking = "";
            this.$refs.barcode.focus();
          } else if (response.data.status == "Error_Phone_Not_Match") {
            alert("ไม่สามารถใช้ Tracking นี้ได้,ใส่รหัสผู้ส่งไม่ถูกต้อง");
            this.quickLinkTracking = "";
            this.$refs.barcode.focus();
          } else if (response.data.status == "Error_Tracking_Cannot_Use") {
            alert(
              "ไม่สามารถใช้ Tracking นี้ได้,เนื่องจาก เลขที่จัดส่งนี้ทำรายการแล้ว"
            );
            this.quickLinkTracking = "";
            this.$refs.barcode.focus();
          } else if (response.data.status == "ERROR_TRACKING_DUPLICATED") {
            alert(
              "ไม่สามารถใช้ Tracking นี้ได้,เนื่องจาก เลขที่จัดส่งนี้ทำรายการแล้ว"
            );
            this.quickLinkTracking = "";
            this.$refs.barcode.focus();
          } else {
            //response.data.status=="Success"
            if (!this.quickLinkTracking) {
              this.is_track_readonly = false;
            } else {
              this.is_track_readonly = true;
              this.is_readonly = false;
              this.quickLinkZipcode = true;
              $(document).ready(function() {
                 $('#zCode').focus();
              });
            }
          }
        })
        .catch(error => {
          this.errored = true;
        });
    },
    addquickLinkZipcode(qlZipcode) {
      axios
        .get(
          "https://pos.945.report/genBillNo/checkZipcode?zipcode=" +
            // "http://206.189.85.185:8100/genBillNo/checkZipcode?zipcode=" +
            this.qlZipcode
        )
        .then(response => {
          this.quickLinkTransport = true;
          if (response.data.length >= 1) {
            this.is_readonly = true;
            var provinceInfo = response.data;
            this.quickLinkProvince1 = response.data[0].PROVINCE_NAME;
            this.quickLinkProvince2 = response.data[1].PROVINCE_NAME;

            this.quickLinkTransport = true;

            // this.$refs.quickLinkKey.focus();
          } else {
            alert("กรอกรหัสไปรษณีย์ไม่ถูกต้อง");
            this.quickLinkProvince1 = "";
            this.quickLinkProvince2 = "";
            this.qlZipcode = "";
            this.$refs.quickLinkZipcode.focus();
            this.quickLinkTransport = false;

            this.is_readonly = false;
          }
          // this.quickLinkTransport = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectTypeQuicklink(parcelType) {
      if (parcelType == "NORMAL") {
        // this.isSendingTypeQuicklink = true;
        this.quickLinkInputCod = false;
        this.quickLinkProduct = true;
        this.is_cod_readonly = false;
        this.quickLinkCodValue = "";
      } else {
        $(document).ready(function() {
          $("#quickLinkInputCOD").focus();
        });
        this.is_cod_readonly = false;
        // this.$refs.inputcod.focus();
        this.quickLinkProduct = false;
        this.quickLinkInputCod = true;
      }
      this.quickLinkDataDetail = false;
      this.quickLinkTypeTransport = parcelType;
    },
    addquickLinkSize() {
      this.intPriceCod = parseInt(this.quickLinkCodValue);
      if (this.intPriceCod == 0 || this.quickLinkCodValue == "") {
        alert("กรอกมูลค่า COD ให้ถูกต้อง");
        this.is_cod_readonly = false;
      } else if (this.intPriceCod >= 10000) {
        alert("มูลค่า COD มีมูลค่าที่สูงมาก ยืนยันการกรอกมูลค่า");
        this.quickLinkProduct = true;
        this.is_cod_readonly = true;
      } else {
        this.quickLinkProduct = true;
        this.is_cod_readonly = true;
      }
    },
    addBtn() {
      this.quickLinkDataDetail = false;
      this.quickLinkBtnAdd = true;
    },
    checkValidation(event) {
      this.is_cod_readonly = false;
      this.is_track_readonly = false;
      this.is_readonly = false;
      this.state.isSending = true;
      // this.btnDisable = true;
      this.quickLinkDataDetail = false;
      this.quickLinkBtnRe = false;
      this.intPriceCod = parseInt(this.quickLinkCodValue);
      if (!this.quickLinkTracking) {
        alert("กรอกข้อมูลให้ครบถ้วน");
      } else if (!this.qlZipcode) {
        alert("กรอกข้อมูลให้ครบถ้วน");
      } else if (!this.quickLinkTypeTransport) {
        alert("กรอกข้อมูลให้ครบถ้วน");
      } else if (!this.quickLinkSelectSize) {
        alert("กรอกข้อมูลให้ครบถ้วน");
      } else if (this.quickLinkTypeTransport == "NORMAL") {
        this.quickLinkCodValue = 0;
        this.addQuiklink();
      } else if (this.quickLinkTypeTransport == "COD") {
        if (this.intPriceCod == 0) {
          alert("กรอกมูลค่า COD");
        } else if (this.intPriceCod > 10000) {
          alert("มูลค่า COD มีมูลค่าที่สูงมาก ยืนยันการกรอกมูลค่า");
          this.addQuiklink();
        } else {
          this.addQuiklink();
        }
      }
    },
    addQuiklink() {
      this.quickLinkDataDetail = false;
      if (this.quickLinkTypeTransport == "NORMAL") {
        this.quickLinkCountNormal++;
        this.quickLinkCountAll++;
      } else if (this.quickLinkTypeTransport == "COD") {
        this.quickLinkCountCOD++;
        this.quickLinkCountAll++;
      }
      var quickLinkdataCount = {
        quickcount_all: this.quickLinkCountAll,
        quickcount_cod: this.quickLinkCountCOD,
        quickcount_normal: this.quickLinkCountNormal
      };
      // this.btnDisable = false;
      this.quickLinkdataCount.push(quickLinkdataCount);
      localStorage.setItem(
        "quickLinkdataCount",
        JSON.stringify(this.quickLinkdataCount)
      );
      // console.log("quickLinkdataCount", this.quickLinkdataCount);

      axios
        .post("https://pos.945.report/genBillNo/parcelPrice", {
          zipcode: this.qlZipcode,
          size_name: this.quickLinkSelectSize
        })
        .then(response => {
          if (response.data.results == false) {
            alert("กรอกรหัสไปรษณีย์ไม่ถูกต้อง");
          }
          this.quickLinkSizePrice = response.data[0].parcel_price;
          this.quickLinkSizeId = response.data[0].size_id;
          //ข้อมูลโชว์ในตาราง Modal
          var dataShowInModal = {
            tracking: this.quickLinkTracking.toUpperCase(),
            zipcode: this.qlZipcode,
            parcel_type: this.quickLinkTypeTransport,
            size_price: this.quickLinkSizePrice,
            cod_value: parseInt(this.quickLinkCodValue),
            size_id: this.quickLinkSizeId,
            select_size: this.quickLinkSelectSize,
            province_name: this.quickLinkProvince1
          };
          console.log("dataShowInModal", dataShowInModal);
          this.quickLinkAddData.push(dataShowInModal);
          console.log("quickLinkAddData", this.quickLinkAddData);

          localStorage.setItem(
            "quickLinkAddData",
            JSON.stringify(this.quickLinkAddData)
          );
          this.quickLinkCountAllinTable++;

          localStorage.setItem(
            "quickLinkCountAllinTable",
            this.quickLinkCountAllinTable
          );
          this.state.isSending = false;
          // localStorage.setItem(
          //   "quickLinkdataCount",
          //   JSON.stringify(this.quickLinkdataCount)
          // );

          // Clear Data
          this.quickLinkTracking = "";
          this.quickLinkZipcode = "";
          this.quickLinkTypeTransport = "";
          this.quickLinkCodValue = "";
          this.quickLinkSelectSize = "";
          this.quickLinkSizePrice = "";
          this.quickLinkSizeId = "";
          this.quickLinkProvince1 = "";
          this.quickLinkProvince2 = "";
          this.qlZipcode = "";
          this.quickLinkZipcode = false;
          this.quickLinkTransport = false;
          this.quickLinkProduct = false;
          this.quickLinkBtnAdd = false;
          this.quickLinkInputCod = false;
          this.$refs.barcode.focus();
          this.is_track_readonly = false;
          this.is_readonly = false;
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    resetQuicklink() {
      this.is_track_readonly = false;
      this.is_readonly = false;
      this.quickLinkBtnRe = false;

      // Clear Data
      this.quickLinkTracking = "";
      this.quickLinkZipcode = "";
      this.quickLinkTypeTransport = "";
      this.quickLinkCodValue = "";
      this.quickLinkSelectSize = "";
      this.quickLinkSizePrice = "";
      this.quickLinkSizeId = "";
      this.quickLinkProvince1 = "";
      this.quickLinkProvince2 = "";
      this.qlZipcode = "";
      this.quickLinkZipcode = false;
      this.quickLinkTransport = false;
      this.quickLinkProduct = false;
      this.quickLinkBtnAdd = false;
      this.quickLinkInputCod = false;
      this.$refs.barcode.focus();
    },
    quickLinkAddDataInTable() {
      this.quickLinkDataDetail = false;
      this.quickLinkCreatebill = false;
      this.countquickLinkTotal = this.txtPrice + this.txtPrice;
      if (this.quickLinkAddData) {
        this.view = "quickLinkDataExpress";
      } else {
        alert("กรุณาทำรายการด่วน");
      }
    },
    removeRow: function(index) {
      this.quickLinkDataDetail = false;
      var lib = JSON.parse(localStorage.getItem("quickLinkAddData"));
      lib = lib.slice(0, index).concat(lib.slice(index + 1, lib.length));
      localStorage.setItem("quickLinkAddData", JSON.stringify(lib));
      // console.log("dataRemove", lib);
      // localStorage.setItem("quickLinkAddData", JSON.stringify(dataRemove));
      if (
        this.quickLinkAddData[index].parcel_type == "COD" &&
        this.quickLinkCountCOD > 0
      ) {
        var quickLinkdataCount = JSON.parse(
          localStorage.getItem("quickLinkdataCount")
        );
        var array = quickLinkdataCount;
        var lastCountData = array[array.length - 1];
        this.quickLinkCountCOD = lastCountData.quickcount_cod--;
        localStorage.setItem(
          "quickLinkdataCount",
          JSON.stringify(quickLinkdataCount)
        );

        this.quickLinkCountCOD--;
      }
      if (
        this.quickLinkAddData[index].parcel_type == "NORMAL" &&
        this.quickLinkCountNormal > 0
      ) {
        var quickLinkdataCount = JSON.parse(
          localStorage.getItem("quickLinkdataCount")
        );
        var array = quickLinkdataCount;
        var lastCountData = array[array.length - 1];
        this.quickLinkCountNormal = lastCountData.quickcount_normal--;
        localStorage.setItem(
          "quickLinkdataCount",
          JSON.stringify(quickLinkdataCount)
        );
        this.quickLinkCountNormal--;
      }
      if (this.quickLinkCountAll > 0) {
        var quickLinkdataCount = JSON.parse(
          localStorage.getItem("quickLinkdataCount")
        );
        var array = quickLinkdataCount;
        var lastCountData = array[array.length - 1];
        this.quickLinkCountAll = lastCountData.quickcount_all--;
        localStorage.setItem(
          "quickLinkdataCount",
          JSON.stringify(quickLinkdataCount)
        );

        this.quickLinkCountAll--;
        this.quickLinkCountAllinTable--;

        var quickLinkCountAllinTable = JSON.parse(
          localStorage.getItem("quickLinkCountAllinTable")
        );
        // console.log(
        //   "quickLinkCountAllinTable get ขึ้นมา",
        //   quickLinkCountAllinTable
        // );

        this.quickLinkCountAllinTable = quickLinkCountAllinTable--;
        // console.log(
        //   "quickLinkCountAllinTable ลบ",
        //   quickLinkCountAllinTable
        // );
        // this.quickLinkCountAllinTable = quickLinkCountAllinTable--;
        localStorage.setItem(
          "quickLinkCountAllinTable",
          JSON.stringify(quickLinkCountAllinTable)
        );
        //  console.log(
        //     "quickLinkCountAllinTable ][หลัง set",
        //     quickLinkCountAllinTable
        //   );
      }
      this.quickLinkAddData.splice(index, 1);
    },
    insertQuiklink() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      this.quickLinkDataDetail = false;
      this.quickLinkTotal = this.quickLinkTotalSum;
       var merid = parseInt(dataLogin.merid);
      var userid = dataLogin.userid;
      var authenlevel = dataLogin.authenlevel;

      // รูปหน้าบัตรประชาชน
      var imgUrl = "";
      if (!this.fileNameUpload) {
        imgUrl =
          "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/5e508c1b_no-image-available.png";
      } else {
        imgUrl =
          "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
          this.fileNameUpload;
      }
      // memberCode
      if (this.memberCode) {
        this.memberCode = this.memberCode;
        this.memberFullName = this.memberFullName;
        this.memberPhone = this.memberPhone;
        this.memberAddress = this.memberAddress;
      } else {
        this.memberData = JSON.parse(localStorage.getItem("memberData"));
        this.memberCode = this.memberData.member_code;
        this.memberFullName =
          this.memberData.first_name + " " + this.memberData.last_name;
        this.memberAddress = this.memberData.address;
        this.memberPhone = this.memberData.phone;
        var phone = this.memberPhone;
        if (phone[0] + phone[1] == "66") {
          this.memberPhone = this.changeDoubleSix(phone);
        } else {
          this.memberPhone = phone;
        }
        // console.log("เบอร์", this.memberPhone);
      }
      var headerQuickLink = {
        branch_id: merid,
        user_id: userid,
        mer_authen_level: authenlevel,
        member_code: this.memberCode,
        carrier_id: this.idCard,
        courier_image: imgUrl,
        sender_name: this.memberFullName,
        sender_phone: this.memberPhone,
        sender_address: this.memberAddress,
        total: this.quickLinkTotal,
        items: []
      };
      var subQuickLink = this.quickLinkAddData;
      // console.log("subQuickLink", subQuickLink);
      // console.log("headerQuickLink", headerQuickLink);
      this.dataSaveQuickLink = headerQuickLink;
      this.dataSaveQuickLink.items = subQuickLink;

      // console.log("ก่อนยิง quickLinkAddData", this.dataSaveQuickLink);
      // console.log(
      //   "ก่อนยิง this.quickLinkAddData",
      //   JSON.stringify(this.dataSaveQuickLink)
      // );

      // console.log("dataSaveQuickLink",  this.dataSaveQuickLink);
      // console.log("dataSaveQuickLink Stringify",    JSON.stringify(this.dataSaveQuickLink));

      axios
        .post(
          "https://pos.945.report/quicklink/quickLink",
          this.dataSaveQuickLink
        )
        .then(response => {
          console.log("response---เลขบิลกลับมา", response.data);
          this.quickLinkBillingNo = response.data.billing_no;
          if(this.quickLinkBillingNo){
            this.$refs.successavebill.open();
          this.view = "quickLinkDataPrint";
          this.$cookie.set("quickLinkBillingNo", this.quickLinkBillingNo, 1);
          }else{
          this.$refs.errorsavebill.open();
          this.view = "quickLinkDataExpress";
          }
          // this.getDataquickLinkPrintBill(this.quickLinkBillingNo);
          return this.quickLinkBillingNo;
        })
        .catch(function(error) {
          console.log(error);
        });

        setTimeout(function(){
          this.$refs.successavebill.close();
           this.$refs.errorsavebill.close();
         }.bind(this),3000);
    },
    getDataquickLinkPrintBill(billing) {
      var bill = this.quickLinkBillingNo;
      var self = this;
      axios
        .get("https://pos.945.report/genBillNo/getReceipt?bill=" + bill)
        .then(response => {
          self.quickLinkDataHeadBill = response.data.data;
          self.quickLinkDataFooterBill = response.data.data2;
          self.quickLinkDataFullName = response.data.data[0].full_name;
          self.quickLinkDataMember = response.data.data[0].member_code;
          self.quickLinkBranchId = response.data.data[0].branch_id;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    valueCOD($event) {
      if ($("#openInCOD").val() == 0) {
        $("#openInCOD").val("");
      }
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault();
      }
    },

    filterNumber(e) {
      //console.log($event.keyCode); //keyCodes value
      console.log('idNumber =>', this.idCard)
      this.idCard = this.idCard.slice(0, 13);
      e.target.value = e.target.value.replace(/[^0-9]+/g, '');
    },

    filterNumber2(e) {
      //console.log($event.keyCode); //keyCodes value
      console.log('idNumber2 =>', this.idCard)
      this.idCard = this.idCard.slice(0, 13);
      e.target.value = e.target.value.replace(/[^0-9]+/g, '');
    },

    onlyNumber($event) {

      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault();
      }
    },

    engOnly($event) {
      var englishAlphabetAndWhiteSpace = /[A-Za-z | 0-9]/g;
      // let keyCode = $event.keyCode ? $event.keyCode : $event.which;

      var key = String.fromCharCode(event.which);
      if (
        event.keyCode == 8 ||
        event.keyCode == 37 ||
        event.keyCode == 39 ||
        englishAlphabetAndWhiteSpace.test(key)
      ) {
        return true;
      }
      $event.preventDefault();
    },

    btnClickCreateBill() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      var meridGet = dataLogin.merid;
      var merid = meridGet;
      // console.log("merid", merid);
      var memberCode = this.idmember;
      var carrierId = this.idCard;
      this.$cookie.set("carrierId", carrierId, 1);
      var codeToCheck = "";
      const options = { okLabel: "ตกลง" };

      // เช็ค memberCode กรอกเบอร์โทร 10 หลัก และรหัสบัตรประชาชน 13 หลัก
      if(memberCode.length == 0){
         this.$dialogs.alert(
          "กรุณากรอก รหัสสมาชิก/เบอร์โทรศัพท์/เลขที่บัตรประชาชน ให้ครบถ้วน",
          options
        );
      } 
      else if(memberCode.length == 10){
          if (
          memberCode[0] + memberCode[1] == "06" ||
          memberCode[0] + memberCode[1] == "08" ||
          memberCode[0] + memberCode[1] == "09"
        ) {
          codeToCheck = this.changeZeroToDoubleSix(memberCode);
          console.log("codeToCheck",codeToCheck);
          if (codeToCheck == undefined) {
            this.$dialogs.alert("กรุณากรอก เบอร์โทรศัพท์ ให้ถูกต้อง", options);
          }else {
          if(carrierId.length == 0 || carrierId.length != 13  || carrierId.length < 13){
            this.$dialogs.alert("กรุณากรอก หมายเลขบัตรประชาชนผู้ส่ง ให้ครบ", options);
          }else{
            // alert("ส่งไปเช็ค");
            this.checkMemberAndCarrier();
              // ส่งไปเข้าไป
             }  
          }
        } else{
          this.$dialogs.alert(
          "กรุณากรอก รหัสสมาชิก/เบอร์โทรศัพท์/เลขที่บัตรประชาชน ให้ครบถ้วน",
          options
            );
          }
      }else if(memberCode.length > 13){
        this.$dialogs.alert(
          "กรุณากรอก รหัสสมาชิก/เบอร์โทรศัพท์/เลขที่บัตรประชาชน ให้ครบถ้วน",
          options
        );
      }
      else if(carrierId.length == 0 || carrierId.length != 13  || carrierId.length < 13){
        this.$dialogs.alert("กรุณากรอก หมายเลขบัตรประชาชนผู้ส่ง ให้ครบ", options);  
      }else{
        this.checkMemberAndCarrier();
        //  alert("ส่งไปเช็ค");
      }


     
    },
    checkMemberAndCarrier(){
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      var meridGet = dataLogin.merid;
      var merid = meridGet;
      var memberCode = this.idmember;
      var carrierId = this.idCard;
      var codeToCheck = "";
      const options = { okLabel: "ตกลง" };
      const dataCheck = {
        merId: merid,
        member_code: memberCode
      };
      axios
        .post(
          "https://www.945api.com/parcel/check/member/api",
          JSON.stringify(dataCheck)
        )
        .then(resultMember => {
          // console.log("resultMember", resultMember.data);
          if (resultMember.data.status == "ERROR_NOT_FOUND") {
            this.$dialogs.alert(
              "ไม่พบรหัสสมาชิกนี้ในระบบ,กรุณากรอกรหัสสมาชิกที่ลงทะเบียนไว้ให้ถูกต้อง",
              options
            );
          // } else if (carrierId.length == 0 || carrierId.length != 13) {
          //   this.$dialogs.alert(
          //     "กรุณากรอกรหัสบัตรประชาชนผู้นำส่งให้ถูกต้อง",
          //     options
          //   );
          } else {
            this.view = "createBill2";
            this.$cookie.set("carrierId", carrierId, 1);

            // Upload Image ก่อน
            let formData = new FormData();
            let file = this.files[0];
            formData.append("file", file);
            function main() {
              return axios
                .post("https://api.945cs.work/upload_frontend", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then(data => {
                  return data.data;
                });
            }
            main().then(data => {
              this.fileNameUpload = data.fileName;
              this.newbillKeyData.push(
                this.idmember,
                this.idCard,
                this.fileNameUpload
              );
              // console.log(
              //   "newbillkeydata =>",
              //   JSON.stringify(this.newbillKeyData)
              // );
              localStorage.setItem(
                "newbillkeydata",
                JSON.stringify(this.newbillKeyData)
              );
            });
          }
          this.memberData = resultMember.data;
          // console.log("memberData", this.memberData);
          this.memberCode = resultMember.data.member_code;
          this.$cookie.set("memberCode", memberCode, 1);
          this.memberFullName =
            resultMember.data.first_name + " " + resultMember.data.last_name;
          this.memberPhone = resultMember.data.phone;
          this.memberAddress = resultMember.data.address;
          // console.log(
          //   "member",
          //   this.memberFullName,
          //   this.memberPhone,
          //   this.memberAddress
          // );
          localStorage.setItem("memberData", JSON.stringify(resultMember.data));
          // this.quickLinkTextPhone = resultMember.data[0].phone;
          // this.dataFullName = resultMember.data[0].full_name;
          // this.dataphone = resultMember.data[0].phone;
          // this.dataaddress = "รอฟิลที่อยู่ใน API";
          // var phoneNo = resultMember.data[0].phone;
          // if (phoneNo[0] + phoneNo[1] == "66") {
          //   this.checkPhoneNumber = this.changeDoubleSix(phoneNo);
          // } else {
          //   this.checkPhoneNumber = phoneNo;
          // }
        })
        .catch(function(error) {
          console.log(error);
        });
    
    },
    changeZeroToDoubleSix(tels) {
      if (
        tels[0] + tels[1] == "06" ||
        tels[0] + tels[1] == "08" ||
        tels[0] + tels[1] == "09"
      ) {
        var phoneNO = "66";
        for (let i = 1; i < tels.length; i++) {
          phoneNO += tels[i];
        }
        return phoneNO;
      }
    },
    changeDoubleSix(tels) {
      if (tels[0] + tels[1] == "66") {
        var phoneNO = "0";
        for (let i = 2; i < tels.length; i++) {
          phoneNO += tels[i];
        }
        return phoneNO;
      }
    },

    btnAddList() {
      //ลบการทำQuicklink
      localStorage.removeItem("quickLinkAddData");
      localStorage.removeItem("quickLinkdataCount");
      localStorage.removeItem("quickLinkCountAllinTable");
      this.view = "createBill3";
    },

    selectCOD() {
      this.openInputCOD = "open";
    },

    btnBackToCreateBill2() {
      this.view = "createBill2";
      this.state.isSending = false;
    },

    btnBackToCreateBill3() {
      this.view = "createBill3";
      this.listTracking.parcelType = "";
      this.listTracking.inputTracking = "";
      this.listTracking.selectZipCode = "";
      this.listTracking.inputRemark = "";
      this.listTracking.inputAddress = "";
      this.listTracking.inputName = "";
      this.listTracking.inputPhoneNumber = "";
      this.listTracking.cod_value = 0;
      this.listTracking.size_id = 0;
      this.listTracking.size_price = 0;
      this.openInputCOD = "false";

      this.listTracking.address.AMPHUR_ID = "";
      this.listTracking.address.AMPHUR_NAME = "";
      this.listTracking.address.DISTRICT_ID = "";
      this.listTracking.address.DISTRICT_NAME = "";
      this.listTracking.address.PROVINCE_ID = "";
      this.listTracking.address.PROVINCE_NAME = "";
      this.listTracking.address.district_code = "";
      this.listTracking.address.zipcode = "";
    },

    btnBackToCreateBill() {
      this.view = "createBill3";

      this.listTracking.parcelType = "";
      this.listTracking.inputTracking = "";
      this.listTracking.selectZipCode = "";
      this.listTracking.inputRemark = "";
      this.listTracking.inputAddress = "";
      this.listTracking.inputName = "";
      this.listTracking.inputPhoneNumber = "";
      this.listTracking.cod_value = 0;
      this.listTracking.size_id = 0;
      this.listTracking.size_price = 0;
      this.openInputCOD = "false";

      this.listTracking.address.AMPHUR_ID = "";
      this.listTracking.address.AMPHUR_NAME = "";
      this.listTracking.address.DISTRICT_ID = "";
      this.listTracking.address.DISTRICT_NAME = "";
      this.listTracking.address.PROVINCE_ID = "";
      this.listTracking.address.PROVINCE_NAME = "";
      this.listTracking.address.district_code = "";
      this.listTracking.address.zipcode = "";

      this.inputNewGetZipCode = "";
    },

    btnBackToTable() {
      this.view = "createBill8";
    },

    selectTypePOS(type) {
      if (type == "NORMAL") {
        this.listTracking.parcelType = "NORMAL";
        this.view = "createBill4";
      } else if (type == "COD") {
        this.openInputCOD = "open";
      }
    },

    selectBoxCOD() {
      $(document).ready(function() {
        $("#openInCOD").focus();
      });
      if (this.openInputCOD == "open" && this.listTracking.cod_value == 0) {
        this.$dialogs.alert("กรุณาใส่มูลค่าเก็บเงินปลายทางให้ถูกต้อง");
      } else if (this.listTracking.cod_value >= 10000) {
        var msgAlert =
          "มูลค่า COD " +
          this.listTracking.cod_value +
          " บาทนี้ ถูกต้องหรือไม่, กรุณาตรวจสอบอีกครั้ง";
        const options = { cancelLabel: "ยกเลิก", okLabel: "ยืนยัน" };
        this.$dialogs.confirm(msgAlert, options).then(res => {
          if (res.ok == true) {
            this.listTracking.parcelType = "COD";
            this.view = "createBill4";
          }
        });
      } else {
        this.listTracking.parcelType = "COD";
        this.view = "createBill4";
      }
    },

    selectBox(selectBox) {
      var valueSize = selectBox;
      var sizeName = valueSize.replace("Plus", "+");
      this.listTracking.sizeBox = sizeName;
      this.view = "createBill5";
      // document.getElementById("receiverName").focus();
    },

    inputCheckFormatName($event) {
      var keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (!(keyCode < 48 || keyCode > 57)) {
        $event.preventDefault();
      }
      // var englishAlphabetAndWhiteSpace = /[A-Za-z | กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์ | .\#/@$]/;
      // var key = String.fromCharCode(event.which);
      // if (
      //   event.keyCode == 8 ||
      //   event.keyCode == 37 ||
      //   event.keyCode == 39 ||
      //   englishAlphabetAndWhiteSpace.test(key)
      // ) {
      //   return true;
      // }
      // $event.preventDefault();
    },

    acceptSend() {
      this.state.isSending = false;
      var fullName = " ";
      // var fullName =
      //   "[a-zA-Z|กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]+[ ][a-zA-Z|กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์.]+";
      var phone = this.listTracking.inputPhoneNumber;
      const options = { okLabel: "ตกลง" };
      if (!this.listTracking.inputName) {
        this.$dialogs.alert("กรุณากรอกชื่อ และนามสกุล", options);
      } else if (!this.listTracking.inputName.match(fullName)) {
        this.$dialogs.alert("กรุณากรอกนามสกุล ให้ถูกต้อง", options);
      } else if (phone.length < 10) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์มือถือ ให้ถูกต้อง", options);
      } else if (
        !(
          phone[0] + phone[1] == "06" ||
          phone[0] + phone[1] == "08" ||
          phone[0] + phone[1] == "09"
        )
      ) {
        this.$dialogs.alert("กรุณากรอกเบอร์โทรศัพท์มือถือเท่านั้น", options);
      } else if (!this.listTracking.address.zipcode) {
        this.$dialogs.alert("กรุณาเลือกไปรษณีย์", options);
      } else if (!this.listTracking.inputAddress) {
        this.$dialogs.alert("กรุณากรอกที่อยู่", options);
      } else {
        this.view = "createBill6";
      }
    },

    showTDZ() {
      // console.log("zipcode", this.listTracking.address.zipcode);
      // console.log("size_name", this.listTracking.sizeBox);
      this.view = "createBill7";
      axios
        .post("https://pos.945.report/genBillNo/parcelPrice", {
          // .post("https://parcel-nodejs.herokuapp.com/genBillNo/parcelPrice", {
          zipcode: this.listTracking.address.zipcode,
          size_name: this.listTracking.sizeBox
        })
        .then(resultsSizePrice => {
          // console.log("ราคากล่อง", resultsSizePrice.data);
          this.checkSizePrice = resultsSizePrice.data[0].parcel_price;
          this.checkSizeID = resultsSizePrice.data[0].size_id;
          // console.log("checkSizePrice", this.checkSizePrice);
          // console.log("checkSizeID", this.checkSizeID);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    btnNextInputTDZ() {
      this.state.isSending = true;
      // console.log(
      //   "tracking ตอนกดตกลง",
      //   this.listTracking.inputTracking.toUpperCase()
      // );
      const options = { okLabel: "ตกลง" };
      this.btnBack = "yes";
      var barcodeReg = /^[T|t][D|d][Z|z]+[0-9]{8}[A-Z]?$/i;
      var dataTrackingPos = this.finalDataSave.listTracking;
      var inputTrack = this.listTracking.inputTracking.toUpperCase();

      // console.log("datatrack", dataTrackingPos);
      // console.log("inputTrack", inputTrack);

      if (!this.listTracking.inputTracking) {
        this.$dialogs.alert("กรุณากรอกเลขที่จัดส่งให้ถูกต้อง", options);
        this.state.isSending = false;
      // }else if (!this.listTracking.inputTracking.match(barcodeReg)) {
        }else if (this.listTracking.inputTracking.match(barcodeReg) === null) {
        this.$dialogs.alert("เลขที่จัดส่งไม่ถูกต้อง", options).then(res => {
          this.$refs.focusTDZ.focus();
        });
        this.state.isSending = false;
      } else if (dataTrackingPos.length > 0) {
        var resultData = [];
        // console.log("data0 =>", dataTrackingPos[0]);
        // console.log("มากกว่า 0");
        dataTrackingPos.forEach((val, key, result) => {
          resultData[key] = dataTrackingPos[key];
        });
        const result = resultData.filter(v => {
          return v.tracking == inputTrack;
        }).length;
        // console.log("result", result);
        if (result >= 1) {
          alert("ไม่สามารถใช้เลขที่จัดส่งนี้ได้, เลขจัดส่งถูกใช้งานไปแล้ว");
          this.state.isSending = false;
          return false;
        } else {
          axios
            .get(
              "https://pos.945.report/billingPos/checkTracking?tracking=" +
                this.listTracking.inputTracking.toUpperCase()
            )
            .then(resultsCheckTracking => {
              // console.log(
              //   "---resultsCheckTracking---",
              //   resultsCheckTracking.data
              // );
              if (resultsCheckTracking.data == true) {
                // console.log("เลขผ่าน");
                //ข้อมูลอยุ่ในตารางเตรียมบันทึก
                this.view = "createBill8";
                var imgUrl = "";
                var remark = "";
                var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
                var merid = parseInt(dataLogin.merid);
                var userid = parseInt(dataLogin.userid);
                var authenlevel = dataLogin.authenlevel;
                if (!this.fileNameUpload) {
                  imgUrl =
                    "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/5e508c1b_no-image-available.png";
                } else {
                  imgUrl =
                    "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
                    this.fileNameUpload;
                }

                if (!this.listTracking.inputRemark) {
                  remark = "";
                } else {
                  remark = this.listTracking.inputRemark;
                }
                var phone = this.memberPhone;
                if (phone[0] + phone[1] == "66") {
                  this.memberPhone = this.changeDoubleSix(phone);
                } else {
                  this.memberPhone = phone;
                }
                // console.log("phone66", this.memberPhone);
                var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
                var merid = parseInt(dataLogin.merid);
                var userid = parseInt(dataLogin.userid);
                var authenlevel = dataLogin.authenlevel;

                if (this.memberCode) {
                  this.memberCode = this.memberCode;
                  this.memberFullName = this.memberFullName;
                  this.memberPhone = this.memberPhone;
                  this.memberAddress = this.memberAddress;
                } else {
                  this.memberData = JSON.parse(
                    localStorage.getItem("memberData")
                  );
                  this.memberCode = this.memberData.member_code;
                  this.memberFullName =
                    this.memberData.first_name + "" + this.memberData.last_name;
                  this.memberAddress = this.memberData.address;
                  this.memberPhone = this.memberData.phone;
                  var phone = this.memberPhone;
                  if (phone[0] + phone[1] == "66") {
                    this.memberPhone = this.changeDoubleSix(phone);
                  } else {
                    this.memberPhone = phone;
                  }
                  // console.log("เบอร์", this.memberPhone);
                }

                var receiverInfo = {
                  sender_name: this.memberFullName,
                  sender_phone: this.memberPhone,
                  sender_address: this.memberAddress,
                  receiver_name: this.listTracking.inputName,
                  phone: this.listTracking.inputPhoneNumber,
                  receiver_address: this.listTracking.inputAddress,
                  district_id: this.listTracking.address.DISTRICT_ID,
                  district_name: this.listTracking.address.DISTRICT_NAME,
                  amphur_id: this.listTracking.address.AMPHUR_ID,
                  amphur_name: this.listTracking.address.AMPHUR_NAME,
                  province_id: this.listTracking.address.PROVINCE_ID,
                  province_name: this.listTracking.address.PROVINCE_NAME,
                  zipcode: this.listTracking.address.zipcode,
                  remark: remark
                };

                var billItem = {
                  tracking: this.listTracking.inputTracking.toUpperCase(),
                  size_id: this.checkSizeID,
                  size_box: this.listTracking.sizeBox, //มีโชว์เฉพาะในตาราง
                  size_price: this.checkSizePrice,
                  parcel_type: this.listTracking.parcelType,
                  cod_value: parseInt(this.listTracking.cod_value),
                  address: receiverInfo
                };
                var datainTablePOS = {
                  user_id: userid,
                  branch_id: merid,
                  mer_authen_level: authenlevel,
                  member_code: this.memberCode,
                  carrier_id: this.idCard,
                  courier_image: imgUrl,
                  total: this.totalSum,
                  listTracking: [billItem]
                };
                var that = this;
                // that.datalistPOS.push({ ...datainTablePOS });
                that.datalistPOS.push(Object.assign({}, datainTablePOS));

                localStorage.setItem(
                  "datalistPOS",
                  JSON.stringify(this.datalistPOS)
                );

                // console.log(
                //   "this.เงื่อนไขมีข้อมุลในตาราง...datalistPOS",
                //   this.datalistPOS
                // );

                var objSavebase = {
                  user_id: userid,
                  branch_id: merid,
                  mer_authen_level: authenlevel,
                  member_code: this.memberCode,
                  carrier_id: this.idCard,
                  courier_image: imgUrl,
                  total: this.totalSum,
                  listTracking: []
                };
                var objSavesub = {
                  tracking: this.listTracking.inputTracking.toUpperCase(),
                  size_id: this.checkSizeID,
                  size_price: this.checkSizePrice,
                  parcel_type: this.listTracking.parcelType,
                  cod_value: parseInt(this.listTracking.cod_value),
                  address: receiverInfo
                };

                this.finalObject.push(objSavesub);
                // this.finalObject.push(objSavesub);

                this.finalDataSave = objSavebase;
                this.finalDataSave.listTracking = this.finalObject;

                localStorage.setItem(
                  "finalDataSave",
                  JSON.stringify(this.finalDataSave)
                );

                // console.log("finalDataSave1", this.finalDataSave);
                // localStorage.setItem("dataCount", JSON.stringify(this.dataCount));

                if (this.listTracking.parcelType == "COD") {
                  this.countCOD++;
                  this.countAll++;
                }
                if (this.listTracking.parcelType == "NORMAL") {
                  this.countNormal++;
                  this.countAll++;
                }

                // console.log("ยอดรวม", this.countAll);
                // console.log("ยอดCOD", this.countCOD);
                // console.log("ยอดNORMAL", this.countNormal);

                var dataCount = {
                  count_all: this.countAll,
                  count_cod: this.countCOD,
                  count_normal: this.countNormal
                };

                this.dataCount.push(dataCount);

                // console.log("Count 3 อัน", this.dataCount);
                localStorage.setItem(
                  "dataCount",
                  JSON.stringify(this.dataCount)
                );
                //ส่งข้อมูลเข้าตาราง Temp ยังไม่ได้เวฟลงจริง
                axios
                  .post(
                    "https://pos.945.report/billingPos/addReceiverTemp",
                    datainTablePOS
                  )
                  .then(function(response) {
                    // console.log(
                    //   "API addReceiverTemp เงื่อนไขมีข้อมูลในตาราง",
                    //   response.data
                    // );
                    this.state.isSending = false;
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              } else {
                alert(
                  "ไม่สามารถใช้เลขที่จัดส่งนี้ได้ เลขจัดส่งถูกใช้งานไปแล้ว"
                );
                this.state.isSending = false;
                this.listTracking.inputTracking = "";
                this.$refs.focusTDZ.focus();
              }
            })
            .catch(error => {
              console.log(error);
            });

          return true;
        }
      } else {
        // console.log("เงื่อนไขครั้งแรก กรณี tracking เข้ามาครั้งแรก");
        axios
          .get(
            "https://pos.945.report/billingPos/checkTracking?tracking=" +
              this.listTracking.inputTracking.toUpperCase()
          )
          .then(resultsCheckTracking => {
            // console.log(
            //   "---resultsCheckTracking---",
            //   resultsCheckTracking.data
            // );
            if (resultsCheckTracking.data == true) {
              // console.log("เลขผ่าน");
              //ข้อมูลอยุ่ในตารางเตรียมบันทึก
              var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
              this.view = "createBill8";
              var imgUrl = "";
              var remark = "";
              var merid = parseInt(dataLogin.merid);
              var userid = parseInt(dataLogin.userid);
              // console.log("userid Int", userid);
              var authenlevel = dataLogin.authenlevel;
              if (!this.fileNameUpload) {
                imgUrl =
                  "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/5e508c1b_no-image-available.png";
              } else {
                imgUrl =
                  "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
                  this.fileNameUpload;
              }

              if (!this.listTracking.inputRemark) {
                remark = "";
              } else {
                remark = this.listTracking.inputRemark;
              }
              var phone = this.memberPhone;
              if (phone[0] + phone[1] == "66") {
                this.memberPhone = this.changeDoubleSix(phone);
              } else {
                this.memberPhone = phone;
              }
              // console.log("phone66", this.memberPhone);

              var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
              var merid = parseInt(dataLogin.merid);
              var userid = parseInt(dataLogin.userid);
              var authenlevel = dataLogin.authenlevel;

              if (this.memberCode) {
                this.memberCode = this.memberCode;
                this.memberFullName = this.memberFullName;
                this.memberPhone = this.memberPhone;
                this.memberAddress = this.memberAddress;
              } else {
                this.memberData = JSON.parse(
                  localStorage.getItem("memberData")
                );
                this.memberCode = this.memberData.member_code;
                this.memberFullName =
                  this.memberData.first_name + "" + this.memberData.last_name;
                this.memberAddress = this.memberData.address;
                this.memberPhone = this.memberData.phone;
                var phone = this.memberPhone;
                if (phone[0] + phone[1] == "66") {
                  this.memberPhone = this.changeDoubleSix(phone);
                } else {
                  this.memberPhone = phone;
                }
                // console.log("เบอร์", this.memberPhone);
              }

              var receiverInfo = {
                sender_name: this.memberFullName,
                sender_phone: this.memberPhone,
                sender_address: this.memberAddress,
                receiver_name: this.listTracking.inputName,
                phone: this.listTracking.inputPhoneNumber,
                receiver_address: this.listTracking.inputAddress,
                district_id: this.listTracking.address.DISTRICT_ID,
                district_name: this.listTracking.address.DISTRICT_NAME,
                amphur_id: this.listTracking.address.AMPHUR_ID,
                amphur_name: this.listTracking.address.AMPHUR_NAME,
                province_id: this.listTracking.address.PROVINCE_ID,
                province_name: this.listTracking.address.PROVINCE_NAME,
                zipcode: this.listTracking.address.zipcode,
                remark: remark
              };

              var billItem = {
                tracking: this.listTracking.inputTracking.toUpperCase(),
                size_id: this.checkSizeID,
                size_box: this.listTracking.sizeBox, //มีโชว์เฉพาะในตาราง
                size_price: this.checkSizePrice,
                parcel_type: this.listTracking.parcelType,
                cod_value: parseInt(this.listTracking.cod_value),
                address: receiverInfo
              };
              var datainTablePOS = {
                user_id: userid,
                branch_id: merid,
                mer_authen_level: authenlevel,
                member_code: this.memberCode,
                carrier_id: this.idCard,
                courier_image: imgUrl,
                total: this.totalSum,
                listTracking: [billItem]
              };
              var that = this;
              // that.datalistPOS.push({ ...datainTablePOS });
              that.datalistPOS.push(Object.assign({}, datainTablePOS));

              localStorage.setItem(
                "datalistPOS",
                JSON.stringify(this.datalistPOS)
              );

              // console.log(
              //   "this.เงื่อนไขมีข้อมุลในตาราง...datalistPOS",
              //   this.datalistPOS
              // );

              var objSavebase = {
                user_id: userid,
                branch_id: merid,
                mer_authen_level: authenlevel,
                member_code: this.memberCode,
                carrier_id: this.idCard,
                courier_image: imgUrl,
                total: this.totalSum,
                listTracking: []
              };
              var objSavesub = {
                tracking: this.listTracking.inputTracking.toUpperCase(),
                size_id: this.checkSizeID,
                size_price: this.checkSizePrice,
                parcel_type: this.listTracking.parcelType,
                cod_value: parseInt(this.listTracking.cod_value),
                address: receiverInfo
              };

              this.finalObject.push(objSavesub);
              // this.finalObject.push(objSavesub);

              this.finalDataSave = objSavebase;
              this.finalDataSave.listTracking = this.finalObject;

              localStorage.setItem(
                "finalDataSave",
                JSON.stringify(this.finalDataSave)
              );

              // console.log("finalDataSave1", this.finalDataSave);
              // localStorage.setItem("dataCount", JSON.stringify(this.dataCount));

              if (this.listTracking.parcelType == "COD") {
                this.countCOD++;
                this.countAll++;
              }
              if (this.listTracking.parcelType == "NORMAL") {
                this.countNormal++;
                this.countAll++;
              }

              // console.log("ยอดรวม", this.countAll);
              // console.log("ยอดCOD", this.countCOD);
              // console.log("ยอดNORMAL", this.countNormal);

              var dataCount = {
                count_all: this.countAll,
                count_cod: this.countCOD,
                count_normal: this.countNormal
              };

              this.dataCount.push(dataCount);

              // console.log("Count 3 อัน", this.dataCount);
              // localStorage.setItem(
              //   "dataCount",
              //   JSON.stringify(this.dataCount)
              // );
              //ส่งข้อมูลเข้าตาราง Temp ยังไม่ได้เวฟลงจริง
              axios
                .post(
                  "https://pos.945.report/billingPos/addReceiverTemp",
                  datainTablePOS
                )
                .then(function(response) {
                  // console.log(
                  //   "API addReceiverTemp เงื่อนไขมีข้อมูลในตาราง",
                  //   response.data
                  // );
                  this.state.isSending = false;
                })
                .catch(function(error) {
                  console.log(error);
                });
            } else {
              alert("ไม่สามารถใช้เลขที่จัดส่งนี้ได้ เลขจัดส่งถูกใช้งานไปแล้ว");
              this.state.isSending = false;
              this.listTracking.inputTracking = "";
              this.$refs.focusTDZ.focus();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    successCreateBill() {
      console.log("finaldata", this.finalDataSave);
      var that = this;
      axios
        .post(
          "https://pos.945.report/billingPos/addReceiver",
          that.finalDataSave
        )
        .then(responseBillNo => {
          console.log("DATABILL", responseBillNo.data);
          if(responseBillNo.data){
             that.$refs.successavebill.open();
             that.view = "createBill9"; //หน้าโชว์และมีเลขที่บิลส่งกลับมาพร้อมพิมพ์ใบเสร็จ
             console.log("มีเลขบิล");
             that.billNo = responseBillNo.data.billing_no;
              that.$cookie.set("billNo", that.billNo, 1);
          }else{
            that.$refs.errorsavebill.open();
            that.view = "createBill8";
            //ไม่มีเลขที่บิลส่งกลับมา โชว์หน้า createBill8 อยุ่เหมือนเดิมและแจ้งerrorว่าไม่สามารถบันทึกข้อมูลได้กรุณาตรจสอบเลขจัดส่งพัสดุอีกครั้ง
          }


          // if (responseBillNo.data.status == "ERROR_TRACKING_DUPLICATED") {
          //   alert(
          //     "ไม่สามารถบันทึกข้อมูลได้เลข Tracking ซ้ำกันในตารางหรือมีอยู่ในระบบแล้ว"
          //   );
          //   this.view = "createBill8";
          // }
          // this.billNo = responseBillNo.data.billing_no;
          // this.$cookie.set("billNo", this.billNo, 1);


          return this.billNo;
        })
        .catch(function(error) {
          console.log(error);
        });
     
    },

    deleteEvent: function(index) {
      var lib = JSON.parse(localStorage.getItem("datalistPOS"));
      var lib2 = JSON.parse(localStorage.getItem("finalDataSave"));

      lib = lib.slice(0, index).concat(lib.slice(index + 1, lib.length));
      lib2.listTracking = lib2.listTracking
        .slice(0, index)
        .concat(lib2.listTracking.slice(index + 1, lib2.listTracking.length));

      localStorage.setItem("datalistPOS", JSON.stringify(lib));
      localStorage.setItem("finalDataSave", JSON.stringify(lib2));

      var deleteTracking = this.datalistPOS[index].listTracking[0].tracking;
      axios
        .get(
          "https://pos.945.report/billingPos/deleteReceiverTemp?id=" +
            deleteTracking
        )
        .then(function(response) {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      if (
        this.datalistPOS[index].listTracking[0].parcel_type == "COD" &&
        this.countCOD > 0
      ) {
        var dataCount = JSON.parse(localStorage.getItem("dataCount"));
        var array = dataCount;
        var lastCountData = array[array.length - 1];
        this.countCOD = lastCountData.count_cod--;
        localStorage.setItem("dataCount", JSON.stringify(dataCount));

        this.countCOD--;
      }
      if (
        this.datalistPOS[index].listTracking[0].parcel_type == "NORMAL" &&
        this.countNormal > 0
      ) {
        var dataCount = JSON.parse(localStorage.getItem("dataCount"));
        var array = dataCount;
        var lastCountData = array[array.length - 1];
        this.countNormal = lastCountData.count_normal--;
        localStorage.setItem("dataCount", JSON.stringify(dataCount));
        this.countNormal--;
      }
      if (this.countAll > 0) {
        var dataCount = JSON.parse(localStorage.getItem("dataCount"));
        var array = dataCount;
        var lastCountData = array[array.length - 1];
        this.countAll = lastCountData.count_all--;
        localStorage.setItem("dataCount", JSON.stringify(dataCount));
        this.countAll--;
      }
      if (this.countAll == 0) {
        this.btnBack = "no";
      }
      this.datalistPOS.splice(index, 1);

      this.finalDataSave.listTracking.splice(index, 1);
    },

    clickOpen() {
      this.openZipCode = false;
      this.firstGetZipCode("101");
    },

    clickClose() {
      this.openZipCode = true;
    },

    onSelected(obj) {
      this.listTracking.address = obj;
      this.openZipCode = true;
    },
    firstGetZipCode(inputZipcode) {
      var zipcode = "";
      if (inputZipcode.length > 2 && inputZipcode.length < 6) {
        zipcode = inputZipcode;
        axios
          .get(
            "https://pos.945.report/billingPos/checkZipcode/?zipcode=" + zipcode
          )
          .then(resultsZipCode => {
            if (resultsZipCode.data == false) {
              zipcode = zipcode[0] + zipcode[1] + zipcode[2];
            } else {
              this.dataFirstGetZipCode = resultsZipCode.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        zipcode = "";
      }
    },
    print() {
      $("#confirmModal").modal();
      axios
        .get("http://localhost/thermal/new_print.php?bill=" + this.billNo)
        .then(resultStatus => {
          // $("#confirmModal").modal();
        });
    },
    printQuicklink() {
      $("#confirmModal").modal();
      axios
        .get(
          "http://localhost/thermal/new_print.php?bill=" +
            this.quickLinkBillingNo
        )
        .then(resultStatus => {
          // $("#confirmModal").modal();
        })
        .catch(error => {});
    },
    handleFilesUpload() {
      let uploadedFiles = this.$refs.webcampick.files;
      var d = new Date().getTime();
      this.file = this.$refs.webcampick.files[0];
      this.uploadImg = this.$refs.webcampick.files[0];
      this.filesUpdate();
    },
    removeFile(key) {
      this.btnCamera = "true";
      this.files.splice(key, 1);
      this.filesUpdate();
    },
    enableWebcam() {
      this.showCam = true;
      this.canvas = document.getElementById("canvas");
      this.context = this.canvas.getContext("2d");
      this.video = document.getElementById("video");

      navigator.getMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      navigator.getMedia(
        {
          video: {
            width: { ideal: this.webcamProps.pictureWidth },
            height: { ideal: this.webcamProps.pictureHeight }
          }
        },
        () => {
          navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
            this.video.srcObject = stream;
            this.video.play();
          });
        },
        () => {
          this.showCam = false;
        }
      );
    },
    takeImage() {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.context.drawImage(video, 0, 0);
      let dataURL = canvas.toDataURL("image/jpg");
      let file = this.dataURLtoFile(dataURL, this.defaultFilename + ".jpg");
      this.files.push(file);
      this.readURL(file);
      this.filesUpdate();
      if (this.webcamProps.autoUpload) this.uploadToServer();
      this.baseSixFour = dataURL;
      this.btnCamera = "no";
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    filesUpdate: function() {
      this.$emit("getWebcamPics", this.files);
    },
    readURL(file) {
      let reader = new FileReader();
      reader.onload = e => {
        if (e.target.result.match("image/*")) {
          this.src = e.target.result;
        } else {
          this.src = this.webcamProps.notPictureTypeFilesPreview;
        }
      };
      reader.readAsDataURL(file);
    },
    uploadToServer() {
      let formData = new FormData();
      let file = this.files[0];
      // let file = this.baseSixFour;
      formData.append("file", file);
      function main() {
        return axios
          .post("https://api.945cs.work/upload_frontend", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(data => {
            return data.data;
          });
      }
      main().then(data => {
        this.fileNameUpload = data.fileName;
      });
    },

    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    quicklinkSizeBox(size) {
      var valueSize = size;
      var sizeName = valueSize.replace("Plus", "+");
      this.quickLinkSelectSize = sizeName;
      this.quickLinkBtnAdd = true;
      this.quickLinkBtnRe = true;
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    nextBill() {
      this.$cookie.delete("billNo");
      localStorage.removeItem("datalistPOS");
      localStorage.removeItem("finalDataSave");
      localStorage.removeItem("dataCount");

      // ลบของ QuickLink
      this.$cookie.delete("quickLinkBillingNo");
      localStorage.removeItem("quickLinkdataCount");
      localStorage.removeItem("quickLinkAddData");
      localStorage.removeItem("quickLinkCountAllinTable");

      this.datalistPOS.listTracking = null;
      this.finalDataSave = null;
      this.finalObject = null;
      location.reload();
      // this.view = "createBill2";
    },

    notNextBill() {
      window.location.reload();
      this.$cookie.delete("memberCode");
      this.$cookie.delete("carrierId");
      this.$cookie.delete("billNo");
      this.$cookie.delete("quickLinkBillingNo");
      localStorage.clear();
    },
    changePhone(phone) {
      var phonechange = phone.replace("66", "0");
      return phonechange;
    },
    leaving() {
      alert("ต้องการรีเฟรชใช่มั้ย");
    },
    btnQuicklink() {
      this.$cookie.delete("billNo");
      localStorage.removeItem("datalistPOS");
      localStorage.removeItem("finalDataSave");
      localStorage.removeItem("dataCount");
    },
    inputCheckName($event) {
      var englishAlphabetAndWhiteSpace = /[a-zA-Z0-9กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]/;
      var key = String.fromCharCode(event.which);
      var ew = event.which;
      if (ew == 32) return true;
      if (48 <= ew && ew <= 57) return true;
      if (65 <= ew && ew <= 90) return true;
      if (97 <= ew && ew <= 122) return true;
      if (englishAlphabetAndWhiteSpace.test(key)) return true;
      $event.preventDefault();
    }
  },

  computed: {
   reverseItems() {
        return this.quickLinkAddData.slice().reverse();
      },
    quickLinkTotalSum: function() {
      return this.quickLinkAddData.reduce(function(quickLinkTotal, item) {
        return quickLinkTotal + item.size_price;
      }, 0);
    },

    totalSum: function() {
      return this.datalistPOS.reduce(function(total, item) {
        return total + item.listTracking[0].size_price;
      }, 0);
    }
  }
};
</script>


<style>
@import "../assets/css/style.css";
body {
  background: rgb(255, 255, 255);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(237, 236, 242, 1) 100%
  );
}
@media print {
  .border {
    height: 0.5px;
    background-color: black;
  }
}

.scoll-tree {
  width: 5000px;
}
.btn-primary {
  height: 50px !important;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.modal-confirm {
  color: #636363;
  width: 325px;
}
.modal-confirm .modal-content {
  padding: 20px;
  border-radius: 5px;
  border: none;
}
.modal-confirm .modal-header {
  border-bottom: none;
  position: relative;
}
.modal-confirm h4 {
  text-align: center;
  font-size: 26px;
  margin: 30px 0 -15px;
}
.modal-confirm .form-control,
.modal-confirm .btn {
  min-height: 40px;
  border-radius: 3px;
}
.modal-confirm .close {
  position: absolute;
  top: -5px;
  right: -5px;
}
.modal-confirm .modal-footer {
  border: none;
  text-align: center;
  border-radius: 5px;
  font-size: 13px;
}
.modal-confirm .icon-box {
  color: #fff;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: -70px;
  width: 95px;
  height: 95px;
  border-radius: 50%;
  z-index: 9;
  background: #82ce34;
  padding: 15px;
  text-align: center;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}
.modal-confirm .icon-box i {
  font-size: 58px;
  position: relative;
  top: 3px;
}
.modal-confirm.modal-dialog {
  margin-top: 80px;
}
.modal-confirm .btn {
  color: #fff;
  border-radius: 4px;
  background: #82ce34;
  text-decoration: none;
  transition: all 0.4s;
  line-height: normal;
  border: none;
}
.modal-confirm .btn:hover,
.modal-confirm .btn:focus {
  background: #6fb32b;
  outline: none;
}
.trigger-btn {
  display: inline-block;
  margin: 100px auto;
}
.searchZipCode {
  width: 100%;
  /* padding: 12px 20px; */
  padding-top: 7px;
  padding-bottom: 7px;
  /* margin: 8px 0; */
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.datalist {
  font-size: 14px;
}

.hoverSelectZipcode li:hover {
  background: rgb(218, 218, 218);
  cursor: pointer;
}

.center {
  margin: auto;
  width: 50%;
}
.modal.modal-wide .modal-dialog {
  width: 90%;
}
.modal-wide .modal-body {
  overflow-y: auto;
}

body p {
  max-width: 400px;
  margin: 20px auto;
}
#tallModal .modal-body p {
  margin-bottom: 900px;
}

.modalHeader {
  background-color: #051a9f;
  border-radius: 2px 2px 0px 0px;
}
.panelHeader {
  background-color: #d2d2d2 !important;
  color: #fff;
}
.panelborder {
  background-color: #ececec;
  border-radius: 5px;
  border: 1px solid #bfbfbf;
  margin-bottom: 20px;
}
.btn-label {
  position: relative;
  left: -12px;
  display: inline-block;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px 0 0 3px;
}
.btn-labeled {
  padding-top: 0;
  padding-bottom: 0;
}
.btn {
  margin-bottom: 10px;
}
.btn-normal {
  border-bottom-width: 0px;
  padding-bottom: 0px;
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.btn-normal:focus {
  background-color: rgb(6, 55, 216);
  -webkit-box-shadow: -1px -1px 5px 3px rgba(40, 96, 144, 1);
  -moz-box-shadow: -1px -1px 5px 3px rgba(40, 96, 144, 1);
  box-shadow: -1px -1px 5px 3px rgba(40, 96, 144, 1);
  outline: none;
}
.btn-cod {
  padding-top: 7px;
  padding-bottom: 7px;
}
.btn-cod:focus {
  background-color: rgb(4, 117, 4);
  border-color: #449d44;
  -webkit-box-shadow: -1px -1px 5px 3px rgba(68, 157, 68, 1);
  -moz-box-shadow: -1px -1px 5px 3px rgba(68, 157, 68, 1);
  box-shadow: -1px -1px 5px 3px rgba(68, 157, 68, 1);
  outline: none;
}
.btn-size:focus {
  background-color: #ce7b06;
  -webkit-box-shadow: 1px 5px 19px 8px rgba(224, 128, 11, 1);
  -moz-box-shadow: 1px 5px 19px 8px rgba(224, 128, 11, 1);
  box-shadow: 1px 5px 19px 8px rgba(224, 128, 11, 1);
  border: 3px solid rgba(224, 128, 11, 1);
  outline: none;
}
.quicklink-count {
  margin-left: 0px;
  text-align: left;
  font-size: 18px;
}

.center {
  margin: auto;
  width: 50%;
}

.webcampick-width {
  width: 100%;
}
.grid-row {
  padding: 20px;
}
.grid-container {
  display: grid;
}
.grid-container--fit {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.grid-element {
  position: relative;
  padding: 20px;
}

.make-photo-btn {
  color: #fff;
  position: absolute;
  margin-top: 0;
  top: 20px;
  left: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom-right-radius: 10px;
}
.make-photo-btn:hover {
  background: rgba(0, 0, 0, 0.5);
}
.btn-add {
  padding-bottom: 0px;
  padding-top: 0px;
  height: 52px;
}
.btn-quick {
  padding-bottom: 0px;
  padding-top: 0px;
  margin-top: 20px;
  height: 52px;
}
.input-tracking {
  height: 48.979166px;
  text-transform: uppercase !important;
}

table {
  overflow-y: scroll;
  background-color: #a5b1ff;
}
.t-table {
  height: 100px !important;
}
tbody {
  background-color: #e1e5ff;
}
.panel-default {
  border-bottom-width: 0px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-left-width: 0px;
}
.panel-default > .panel-heading {
  color: white;
  background-color: #291e9c !important;
}
.panel-body {
  background-color: #e6e8f9;
}
.btn-secondary {
  background-color: gray;
  color: white;
}
.btn-info {
  color: white;
  background-color: #007de8;
  border-color: #007de8;
}
.btn-info:hover,
.btn-info:focus,
.btn-info:active,
.btn-info.active,
.open > .dropdown-toggle.btn-info {
  color: white;
  background-color: #007de8;
  border-color: #007de8;
}
.btn {
  -webkit-box-shadow: 0 8px 6px -6px #999;
  -moz-box-shadow: 0 8px 6px -6px #999;
  box-shadow: 0 8px 6px -6px #999;
}
.searchZipCode {
  background-color: white;
}
</style>
