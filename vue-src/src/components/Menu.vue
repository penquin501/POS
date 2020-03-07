<template>
  <div>
    <nav
      class="navbar fixed-top navbar-light bg-light navbar-fixed-top"
      style="background-color:rgb(209, 213, 253) !important"
    >
      <a class="navbar-brand" href="#">
        <b style="color: #6c6c6c;">Parcel Shop</b>
      </a>
      <ul
        class="nav navbar-nav navbar-right"
        style="
    margin-left: 30px;
    margin-right: 30px;
"
      >
        <li>
          <a href="#">
            <span class="glyphicon glyphicon-user"></span>
            {{ usernamelogin }}@{{ mername }}
          </a>
        </li>
        <li>
          <a href="#" v-on:click="logoutParcel">
            <span class="glyphicon glyphicon-log-in"></span> Logout
          </a>
        </li>
      </ul>
    </nav>
    <div class="row">
      <div class="wrapper">
        <div class="side-bar">
          <ul>
            <li class="menu-head">
              <b style="font-size:18px">เมนู</b>

              <a href="#" class="push_menu">
                <span class="glyphicon glyphicon-align-justify pull-right"></span>
              </a>
            </li>
            <div class="menu">
              <li>
                <a class="active" style="padding-bottom: 0px;padding-top: 0px;padding-right: 0px;">
                  <router-link to="/register">
                    ลงทะเบียนใหม่
                    <span class="glyphicon glyphicon-pencil pull-right"></span>
                  </router-link>
                </a>
              </li>
              <li>
                <a href="#" v-on:click="listMamberSend">
                  รายการสมาชิกจัดส่ง
                  <span class="glyphicon glyphicon-th-list pull-right"></span>
                </a>
              </li>
              <li>
                <a href v-on:click="listSend">
                  รายงานการจัดส่ง
                  <span class="glyphicon glyphicon-list-alt pull-right"></span>
                </a>
              </li>
              <li>
                <a href v-on:click="typeSize">
                  ระบุไซส์ Warehouse
                  <span class="glyphicon glyphicon-ok pull-right"></span>
                </a>
              </li>
              <li>
                <a href v-on:click="checkStatus">
                  เช็คสถานะพัสดุ
                  <span class="glyphicon glyphicon-search pull-right"></span>
                </a>
              </li>
              <li>
                <a href="#" v-on:click="parcelCapture">
                  Key - In
                  <span class="glyphicon glyphicon-save-file pull-right"></span>
                </a>
              </li>
              <li>
                <a href="#" v-on:click="findTracking">
                  ค้นหารหัสไปรษณีย์
                  <span class="glyphicon glyphicon-search pull-right"></span>
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row" style="height: 57px; margin-top:65px;">
        <div class="col-sm-3 col-md-3 col-lg-3">
          <button
            v-on:click="register"
            style="height: 57px;padding-top: 5px;"
            class="btn btn-primary btn-lg form-control"
          >
            <img src="../assets/img/note.png" height="35px" />
            &nbsp;ลงทะเบียนใหม่
          </button>
          <!-- </router-link> -->
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3">
          <a
            data-toggle="modal"
            href="#sizeModal"
            class="btn btn-primary btn-lg form-control"
            style="height: 57px;padding-top: 5px;"
            v-on:click="sizeBox"
          >
            <img src="../assets/img/ruler.png" height="35px" /> &nbsp;คำนวณขนาด
          </a>
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3">
          <a
            data-backdrop="static"
            data-toggle="modal"
            href="#listMemberModal"
            id="btnlistmember"
            v-on:click="listlistMember"
            class="btn btn-primary btn-lg form-control"
            style="height: 57px;padding-top: 5px;"
          >
            <img src="../assets/img/profile.png" height="35px" /> &nbsp;ข้อมูลสมาชิก
          </a>
          <!-- <router-link to="/listmember"> -->
          <!-- <button
              style="height: 57px;padding-top: 5px;"
              type="button"
              class="btn btn-primary btn-lg form-control"
              v-on:click="member"
            >
              <img src="../assets/img/profile.png" height="35px" /> &nbsp;ข้อมูลสมาชิก
          </button>-->
          <!-- </router-link> -->
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3">
          <a
            data-backdrop="static"
            data-toggle="modal"
            href="#printModal"
            v-on:click="listBillPre"
            class="btn btn-primary btn-lg form-control"
            style="height: 57px;padding-top: 5px;"
          >
            <img src="../assets/img/printer.png" height="35px" /> &nbsp;สั่งพิมพ์รายการ
          </a>
        </div>
      </div>

      <div class="row" style="height: 57px;">
        <div class="col-sm-3 col-md-3 col-lg-3">
          <button
            style="height: 57px;padding-top: 5px;"
            class="btn btn-primary btn-lg form-control"
            v-on:click="reloadOldBill"
          >
            <img src="../assets/img/list.png" height="35px" />&nbsp;สร้างบิลผู้ส่งเดิม
          </button>
        </div>

        <div class="col-sm-3 col-md-3 col-lg-3"></div>
        <div class="col-sm-3 col-md-3 col-lg-3">
          <!-- <router-link to="/"> -->

          <!-- </router-link> -->
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3">
          <!-- <router-link to="/"> -->
          <button
            style="height: 57px;padding-top: 5px;"
            class="btn btn-primary btn-lg form-control"
            v-on:click="reloadNew"
          >
            <img src="../assets/img/list.png" height="35px" />&nbsp;สร้างบิลผู้ส่งใหม่
          </button>
          <!-- </router-link> -->
        </div>
      </div>

      <div id="printModal" class="modal modal-wide fade">
        <div class="vld-parent">
          <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
        </div>

        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header modalHeader" style="text-align:center;">
              <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <b style="font-size:38px;  color: #FFFFFF;">พิมพ์เอกสาร</b>
                </div>
                <div class="col-sm-4" style="text-align:right !important;">
                  <button data-dismiss="modal" type="button" class="btn btn-danger">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body" style="height:800px;">
              <div class="row" style="text-align:center; font-size:16px;">
                <b style="font-size:22px;">รายการย้อนหลัง 1 สัปดาห์</b>
              </div>

              <div class="row" style="text-align:center; font-size:16px;">
                <div class="col-sm-5 col-md-5 col-lg-5"></div>
                <div
                  class="col-sm-2 col-md-2 col-lg-2"
                  style="text-align: right;padding-right: 0px;"
                ></div>
                <div class="col-sm-5 col-md-5 col-lg-5">
                  <input
                    class="form-control"
                    type="text"
                    v-model="searchBill"
                    placeholder="ค้นหา"
                    style="margin-bottom: 10px;"
                  />
                </div>
              </div>

              <table class="table table-striped">
                <thead style="background-color: #4169E1; color:white;">
                  <tr>
                    <th scope="col" style="text-align:center; width:20%;">
                      <b style="font-size:18px;">หมายเลขบิล</b>
                    </th>
                    <th scope="col" style="text-align:center; width:10%;">
                      <b style="font-size:18px;">เวลาทำรายการ</b>
                    </th>
                    <th scope="col" style="text-align:center; width:30%;">
                      <b style="font-size:18px;">สมาชิก</b>
                    </th>
                    <th scope="col" style="text-align:center; width:50%;">
                      <b style="font-size:18px;">สั่งพิมพ์</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-bind:key="item.id" v-for=" item  in filteredResourcesBill">
                    <td
                      scope="row"
                      value="0"
                      style="text-align:center;"
                    >{{ item.bill_no }}</td>
                    <td
                      scope="row"
                      style="text-align:center; width:20%"
                    >{{ timeCon( parseInt(item.timestamp)) }}</td>
                    <td style="text-align:center;">{{ item.firstname }} {{ item.lastname }}</td>
                    <td style="text-align:right;">
                      <button
                        v-if="item.taxLink != ''"
                        style="margin-bottom: 0px;margin-right: 5px;"
                        type="button btn-success"
                        class="btn btn-success"
                        v-on:click="printTaxInvoice(item.taxLink)"
                      >ใบกำกับภาษี</button>

                      <button
                        style="margin-bottom: 0px;margin-right: 5px;"
                        type="button btn-primary"
                        class="btn btn-info"
                        :disabled="state.isSending"
                        v-on:click="printBillHistory(item.bill_no)"
                      >ใบเสร็จสลิป</button>

                      <button
                        style="margin-bottom: 0px;margin-right: 5px;"
                        v-on:click="getListBillPrint(item.bill_no)"
                        type="button"
                        class="btn btn-warning"
                      >ใบเสร็จ A4</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="listMemberModal" class="modal modal-wide fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header modalHeader" style="text-align:center;">
              <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <b style="font-size:38px;  color: #FFFFFF;">ข้อมูลสมาชิก</b>
                </div>
                <div class="col-sm-4" style="text-align:right !important;">
                  <button data-dismiss="modal" type="button" class="btn btn-danger">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body" style="height:800px;">
              <div class="row" style="text-align:center; font-size:16px;">
                <div class="col-sm-3 col-md-3 col-lg-3"></div>
                <div
                  class="col-sm-2 col-md-2 col-lg-2"
                  style="text-align: right;padding-right: 0px;"
                >
                  <b style="font-size:18px;">ค้นหา</b>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7">
                  <input
                    class="form-control"
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search"
                    style="margin-bottom: 15px;"
                  />
                </div>
              </div>

              <table class="table table-striped">
                <thead style="background-color: #4169E1; color:white;">
                  <tr>
                    <th style="text-align:center; ">
                      <b style="font-size:18px;">เลขสมาชิก</b>
                    </th>
                    <th style="text-align:center; ">
                      <b style="font-size:18px;">บัตรประชาชน</b>
                    </th>
                    <th style="text-align:center; ">
                      <b style="font-size:18px;">ชื่อ</b>
                    </th>
                    <th style="text-align:center; ">
                      <b style="font-size:18px;">เบอร์โทร</b>
                    </th>
                    <th style="text-align:center; ">
                      <b style="font-size:18px;">ที่อยู่</b>
                    </th>
                    <th style="text-align:center;  width:20%">
                      <b style="font-size:18px;"></b>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-bind:key="item.id" v-for="(item) in filteredResources">
                    <td scope="row" value="0" style="text-align:center;">{{ item.member_id }}</td>
                    <td scope="row" value="0" style="text-align:center;">{{ item.citizenid }}</td>
                    <td
                      scope="row"
                      value="0"
                      style="text-align:left;"
                    >{{ item.firstname }} {{ item.lastname }}</td>
                    <td
                      scope="row"
                      value="0"
                      style="text-align:center;"
                    >{{ changePhonemember(item.phoneregis) }}</td>
                    <td scope="row" value="0" style="text-align:left;">{{ item.address }}</td>
                    <td scope="row" value="0" style="text-align:center;">
                      <button
                        type="button"
                        class="btn btn-info"
                        v-on:click="getMember(item.member_id)"
                      >ข้อมูล</button>
                      <button
                        type="button"
                        class="btn btn-success"
                        v-on:click="getDataMember(item.phoneregis,item.address)"
                      >COD</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="updateModal" class="modal modal-wide fade">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header modalHeader" style="text-align:center;">
              <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <b style="font-size:38px;  color: #FFFFFF;">เพิ่มข้อมูลหน้าบัญชี</b>
                </div>
                <div class="col-sm-4" style="text-align:right !important;">
                  <button data-dismiss="modal" type="button" class="btn btn-danger">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <div class="row" style="margin-bottom: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2">
                    <b style="font-size: 18px;">รูปถ่ายหน้าบัญชี</b>
                  </div>
                  <div class="col-sm-10">
                    <input
                      id="fileBank"
                      type="file"
                      accept="image/*"
                      @change="onFileChangeBank"
                      ref="urlBank"
                      v-on:change="handleFileUploadBookBank"
                    />
                  </div>
                  <div class="col-sm-4"></div>
                </div>
                <div class="col-sm-1"></div>
              </div>

              <div class="row" style="margin-bottom: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-10">
                    <div id="preview">
                      <img
                        v-img
                        class="responsive"
                        v-if="urlBank"
                        :src="urlBank"
                        style="margin-top: 0px; height:200px;width:500px;"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4"></div>
                </div>
                <div class="col-sm-1"></div>
              </div>

              <div class="row" style="margin-bottom: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2">
                    <b style="font-size: 18px;">ชื่อบัญชี</b>
                  </div>
                  <div class="col-sm-10">
                    <input
                      v-on:keypress="inputCheckName"
                      v-model="nameBank"
                      placeholder="ชื่อบัญชี"
                      class="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div class="col-sm-1"></div>
              </div>

              <div class="row" style="margin-bottom: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2">
                    <b style="font-size: 18px;">รหัสสาขา</b>
                  </div>
                  <div class="col-sm-10">
                    <input
                      v-on:keypress="onlyNumber"
                      v-model="branchCode"
                      maxlength="3"
                      placeholder="รหัสสาขา"
                      class="form-control"
                      type="text"
                    />
                  </div>
                  <div class="col-sm-4"></div>
                </div>
                <div class="col-sm-1"></div>
              </div>

              <div class="row" style="margin-bottom: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2">
                    <b style="font-size: 18px;">เลขที่บัญชี</b>
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

              <div class="row" style="margin-bottom: 20px;margin-top: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-2">
                    <b style="font-size: 18px;">ธนาคาร</b>
                  </div>
                  <div class="col-sm-10">
                    <select class="form-control dropdown-panel-detail" v-model="codeBank">
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

              <div class="row" style="margin-bottom: 20px;margin-top: 20px;">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <div class="col-sm-4"></div>
                  <div class="col-sm-5"></div>
                  <div class="col-sm-3">
                    <button
                      style="padding-bottom: 0px;margin-bottom: 0px;height: 52px;padding-top: 0px;"
                      type="button"
                      class="btn btn-success btn-lg form-control"
                      v-on:click="btnSaveMember"
                    >บันทึก</button>
                  </div>
                </div>
                <div class="col-sm-1"></div>
              </div>
            </div>
            <!-- <div class="modal-footer"></div> -->
          </div>
        </div>
      </div>

      <div id="showDetailModal" class="modal modal-wide fade">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header modalHeader" style="text-align:center;">
              <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <b style="font-size:38px;  color: #FFFFFF;">ข้อมูลสมาชิก</b>
                </div>
                <div class="col-sm-4" style="text-align:right !important;">
                  <button data-dismiss="modal" type="button" class="btn btn-danger">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="panel-body">
                  <div class="col-sm-5 col-md-5">
                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">เลขสมาชิก</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{dataMember.member_code}}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">ชื่อสมาชิก</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span
                          style="font-size:18px;"
                        >{{dataMember.first_name}} {{dataMember.last_name}}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">เบอร์โทรศัพท์</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{ phoneNum }}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">ที่อยู่</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{ dataMember.address }}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">เลขที่บัญชี</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{dataMember.bank_account_no}}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">ชื่อบัญชี</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{dataMember.bank_acc_name}}</span>
                      </div>
                    </div>

                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-3 col-md-3">
                        <b style="font-size:18px;">ธนาคาร</b>
                      </div>
                      <div class="col-sm-1 col-md-1">
                        <b>:</b>
                      </div>
                      <div class="col-sm-8 col-md-8">
                        <span style="font-size:18px;">{{dataMember.bank_name}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-7 col-md-7">
                    <div class="row" style="padding-bottom: 10px;">
                      <div class="col-sm-6 col-md-6" style="text-align: center;">
                        <img height="260px;" v-bind:src="this.imgBook" />
                      </div>
                      <div class="col-sm-6 col-md-6" style="text-align: center;">
                        <img height="260px;" v-bind:src="this.imgCitizen" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="modal-footer"></div> -->
          </div>
        </div>
      </div>

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
    </div>
    <router-view />

    <!-- Modal HTML -->
    <sweet-modal icon="success" ref="processprint">กำลังดำเนินการพิมพ์ใบเสร็จ</sweet-modal>
    <sweet-modal icon="error" ref="processprintTax">ไม่มีใบกำกับภาษี</sweet-modal>
  </div>
</template>
<script>
var moment = require("moment");
const queryString = require("query-string");
// Vue.use(PreventUnload);

import QueryString from "query-string";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import momentTimezone from "moment-timezone";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  props: ["value"],
  components: {
    SweetModal,
    Loading
  },
  data: function() {
    return {
      showBtn: true,
      menuCreateBill: true,
      menuRegister: false,
      menuInsurance: false,
      menuPrintBill: false,
      menuButton: true,
      printBillList: true,
      bill: true,
      dataLogin: this.value,

      searchBill: "",
      listBill: [],
      printList: [],
      merid: "",
      mername: "",
      merid: "",
      usernamelogin: "",
      userid: "",
      authenlevel: "",
      time: "",
      output: null,

      //listmember
      searchQuery: "",
      memberList: [],
      memberId: "",
      aliasname: "",
      address: "",
      nameBank: "",
      numberBank: "",
      phonemember: "",
      citizenid: "",

      tmemberId: "",
      taliasname: "",
      taddress: "",
      tnameBank: "",
      tnumberBank: "",
      tphonemember: "",

      codeBank: "เลือกธนาคาร",
      url: null,
      urlBank: null,
      imgBookBank: "",
      branchCode: "",
      phoneNum: "",

      taxLink: "",
      timestamp: 0,

      //show img
      imgBook: "",
      imgCitizen: "",

      dataBank: [],
      dataMember: [],
      state: {
        isSending: false
      },
      urlInVoice: [
        "https://secure.peakengine.com/Pdf?emi=NjM0MDE=&eti=MTY5OTYzOQ==&eii=Mw=="
      ],
      listInvoice: [],
      btnTaxInvioce: false,
      // loading
      isLoading: false,
      fullPage: true
    };
  },

  mounted: function() {
    var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
    if (localStorage.dataLogin || dataLogin != null) {
      this.usernamelogin = dataLogin.username;
      this.userid = dataLogin.userid;
      this.mername = dataLogin.mername;
      this.merid = dataLogin.merid;
      this.authenlevel = dataLogin.authenlevel;
    } else {
      window.location.reload();
    }
  },

  methods: {
    sortInvioce(a, b) {
      return b - a;
    },
    listlistMember() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (localStorage.dataLogin || dataLogin != null) {
        var that = this;
        var merid = dataLogin.merid;
        const data = {
          branch_id: merid
        };
        console.log("Datacheckmember", data);
        axios
          .post(
            "https://www.945api.com/parcel/list/member/api",
            JSON.stringify(data)
          )
          .then(function(response) {
            console.log(response.data);
            console.log(response.data.listMember);
            that.memberList = response.data.listMember;
            //  console.log("list", response.data.listMember);
            that.getDataBank();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        window.location.reload();
      }
    },
    changePhone(phone) {
      var phonechange = phone.replace("66", "0");
      return phonechange;
    },
    changePhonemember(phone) {
      var phonechange;
      if (phone == null) {
        phonechange = "-";
      } else {
        phonechange = phone.replace("66", "0");
      }
      // var phonechange = phone.replace("66", "0");
      return phonechange;
    },

    editMember() {
      $("#updateModal").modal();
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
    getDataBank(index) {
      axios
        .get("https://www.945api.com/parcel/agent/bank/name")
        .then(resultsDataBank => {
          this.dataBank = resultsDataBank.data;
          // console.log("databank", this.dataBank);
        })
        .catch(error => {
          console.log(error);
        });
    },
    inputCheckFormatName($event) {
      var thai =
        /[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]/ +
        /[ ]/;
      var key = String.fromCharCode(event.which);
      if (
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        thai.test(key)
      ) {
        //48-57(ตัวเลข) ,65-90(Eng ตัวพิมพ์ใหญ่ ) ,97-122(Eng ตัวพิมพ์เล็ก)
        return true;
      } else {
        $event.preventDefault();
        return false;
      }
    },
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    getDataMember(phone, address) {
      var that = this;
      $("#updateModal").modal();
      that.phonemember = phone;
      that.address = address;
      // console.log("list", index);
      // console.log("id", that.memberId);
      // console.log("name", that.aliasname);
      // console.log("phone", that.phonemember);
      // console.log("address", that.address);
    },
    getMember(membercode) {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      var that = this;
      $("#showDetailModal").modal();
      // console.log("list", that.memberId);
      //ยิง API หา
      var meridGet = dataLogin.merid;
      var merid = meridGet;
      var codeToCheck = that.memberId;
      //  var citizenid =  that.citizenid ;
      const dataCheck = {
        merId: merid,
        member_code: membercode
      };
      //  console.log("ยิงหา",dataCheck);
      axios
        .post(
          "https://www.945api.com/parcel/check/member/api",
          JSON.stringify(dataCheck)
        )
        .then(resultMember => {
          that.dataMember = resultMember.data;
          var pp = resultMember.data.phone;
          var phonechange = pp.replace("66", "0");
          that.phoneNum = phonechange;
          // console.log(phonechange);
          // console.log("dataMember",that.dataMember);
          // console.log("ชื่อ",resultMember.data.first_name + '' + resultMember.data.last_name);
          //เรียก API นำรูป
          this.getImageMember(membercode);
          // $("#showDetailModal").modal();
        })

        .catch(function(error) {
          console.log(error);
        });
    },
    getImageMember(membercode) {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      //ยิง API หา
      var meridGet = dataLogin.merid;
      var merid = meridGet;
      var memcode = membercode;
      //  console.log("merid",merid);
      //  console.log("memcode",memcode);
      const data = {
        member_code: memcode,
        branch_id: merid,
        source: "parcel"
      };
      axios
        .post(
          "https://www.945api.com/parcel/select/img/url/api",
          JSON.stringify(data)
        )
        .then(resultMember => {
          // console.log("resultMember1",resultMember.data.memberImgIng);
          this.imgBook = resultMember.data.memberImgIng.imgUrlBank;
          this.imgCitizen = resultMember.data.memberImgIng.imgUrlCitizen;
          // console.log("this.imgBook",this.imgBook);
          // console.log("this.imgCitizen",this.imgCitizen);
          // $("#showDetailModal").modal();
        })

        .catch(function(error) {
          console.log(error);
        });
    },
    btnSaveMember() {
      // console.log("upLoadImgBookBank");
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
        // console.log("imgBookBank", this.imgBookBank);
        this.dataSave();
      });
    },

    member() {
      this.$router.push({ path: "/listmember" });
    },
    register() {
      localStorage.removeItem("dataRegisterRE");
      window.location.href = "/register";
    },
    reloadOldBill() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (localStorage.dataLogin || dataLogin != null) {
        // ลบของ POS
        this.$cookie.delete("billNo");
        localStorage.removeItem("datalistPOS");
        localStorage.removeItem("finalDataSave");
        localStorage.removeItem("dataCount");

        // ลบของ QuickLink
        this.$cookie.delete("quickLinkBillingNo");
        localStorage.removeItem("quickLinkdataCount");
        localStorage.removeItem("quickLinkAddData");
        localStorage.removeItem("quickLinkCountAllinTable");

        // location.reload();
        window.location.href = "/parcel";
      } else {
        window.location.reload();
      }
    },
    reloadNew() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (localStorage.dataLogin || dataLogin != null) {
        this.$cookie.delete("memberCode");
        this.$cookie.delete("carrierId");
        this.$cookie.delete("billNo");

        localStorage.removeItem("newbillkeydata");
        localStorage.removeItem("memberData");
        localStorage.removeItem("datalistPOS");
        localStorage.removeItem("finalDataSave");
        localStorage.removeItem("dataCount");

        // ลบของ QuickLink
        this.$cookie.delete("quickLinkBillingNo");
        localStorage.removeItem("quickLinkdataCount");
        localStorage.removeItem("quickLinkAddData");
        localStorage.removeItem("quickLinkCountAllinTable");
        // localStorage.removeItem(key);  ต้องลบ!!!!!!!
        // localStorage.clear();
        window.location.href = "/parcel";
        // window.location.reload();
      } else {
        window.location.reload();
      }
    },
    sizeBox() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (localStorage.dataLogin || dataLogin != null) {
        window.open("https://iter.asiazero.com/calbox/", "_blank");
      } else {
        window.location.reload();
      }
    },
    listMamberSend() {
      window.open("https://mb.945cs.work/login", "_blank");
    },
    listSend() {
      window.open(
        "https://pcr.aplatoo.com/login/?redirect_to=https%3A%2F%2Fpcr.aplatoo.com%2F",
        "_blank"
      );
    },
    typeSize() {
      window.open(
        "https://www.my945.me/warehousezone/adjustsize.php",
        "_blank"
      );
    },
    checkStatus() {
      window.open("https://www.945info.com/", "_blank");
    },
    parcelCapture() {
      window.open("https://my945app.firebaseapp.com/parcel-capture", "_blank");
    },
    findTracking() {
      window.open("https://zip.945.report/", "_blank");
    },
    timeCon(date) {
      var datatime = momentTimezone(date)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD HH:mm:ss", true);
      var year = moment(datatime).format("YYYY");
      var year2 = parseInt(year) + 543;
      return moment(datatime).format(" Do MMMM " + year2 + " " + "H:mm");
    },
    getListBillPrint(bill) {
      // console.log("..เลขบิล..", bill);
      window.open(
        "/printPdf/printBillPdf?bill=" + bill,
        "_blank"
      );
    },
    listBillPre() {
      //  this.isLoading = true;
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (localStorage.dataLogin || dataLogin != null) {
        this.listBill = [];
        var branchId = dataLogin.merid;
        axios
          .get(
            "/billingPos/listBillngNo?branch_id=" +
              // "http://127.0.0.1:3100/billingPos/listBillngNo?branch_id=" +
              branchId
          )
          .then(resultList => {
            this.listBill=resultList.data;
          });
      } else {
        window.location.reload();
      }
    },
    printBillHistory(bill) {
      this.$refs.processprint.open();
      axios
        .get("http://localhost/thermal/new_print.php?bill=" + bill)
        .then(resultStatus => {})
        .catch(error => {
          console.log(error);
        });
      setTimeout(
        function() {
          this.$refs.processprint.close();
        }.bind(this),
        3000
      );
    },
    printTaxInvoice(taxLink) {
      var link = taxLink;
      window.open(taxLink);
    },

    btnRegister() {
      this.merid = dataLogin.merid;
      // console.log("merid", this.merid);
      this.menuRegister = true;
      this.menuCreateBill = false;
      this.menuInsurance = false;
      this.$cookie.delete("billNo");
    },
    btnInsurance() {
      this.menuRegister = false;
      this.menuCreateBill = false;
      this.menuInsurance = true;
      this.$cookie.delete("billNo");
    },
    btnList() {
      location.reload();
    },
    logoutParcel() {
      // this.$cookie.delete("username");
      // this.$cookie.delete("userid");
      // this.$cookie.delete("mername");
      // this.$cookie.delete("merid");
      // this.$cookie.delete("authenlevel");
      // this.$cookie.delete("billNo");
      // this.$cookie.delete("carrierId");
      // this.$cookie.delete("memberCode");
      localStorage.clear();

      var path = window.location.href.replace(/(\#.*)/, "");
      window.location.href = path;
      window.location.reload();
    },
    clearPath() {
      var path = window.location.href.replace(/(\#.*)/, "");
      window.location.href = path;
    },
    listMember() {
      var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      var that = this;
      var merid = dataLogin.merid;
      const data = {
        branch_id: merid
      };
      axios
        .post(
          "https://www.945api.com/parcel/list/member/api",
          JSON.stringify(data)
        )
        .then(function(response) {
          that.memberList = response.data.listMember;
          that.getDataBank();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    changePhone(phone) {
      var phonechange = phone.replace("66", "0");
      return phonechange;
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
      });
    },
    getDataBank(index) {
      axios
        .get("https://www.945api.com/parcel/agent/bank/name")
        .then(resultsDataBank => {
          this.dataBank = resultsDataBank.data;
          // console.log("databank", this.dataBank);
        })
        .catch(error => {
          console.log(error);
        });
    },

    dataSave() {
      var that = this;
      var imgUrl = "";
      // var phonechange =  that.phonemember;
      // var res = phonechange.replace("0", "66");
      // console.log("res22",res);
      if (
        !that.imgBookBank ||
        !that.nameBank ||
        !that.numberBank ||
        !that.codeBank.text
      ) {
        alert("กรุณากรอกข้อมูลให้ครบ");
      } else {
        if (that.imgBookBank) {
          imgUrl =
            "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/" +
            that.imgBookBank;
        } else {
          imgUrl =
            "https://upload945.sgp1.digitaloceanspaces.com/uploads/images/frontend/5e508c1b_no-image-available.png";
        }
        const datamember = {
          phoneRegis: that.phonemember,
          address: that.address,
          bankAccName: that.nameBank,
          bankIssue: that.codeBank.text,
          bankAcc: that.numberBank,
          bankBranchCode: that.branchCode,
          imgBookBankUrl: imgUrl,
          source: "parcel"
        };
        // console.log("datamember", datamember);
        axios
          .post(
            "https://www.945api.com/parcel/agent/update/cod/register/api",
            JSON.stringify(datamember)
          )
          .then(function(response) {
            // console.log(response.data.status);
            if (response.data.status == "SUCCESS") {
              $("#updateModal").modal("hide");
              $("#myModal").modal();

              window.location.href = "/parcel";
              setTimeout(function() {
                $("#listMemberModal").modal("show");
              }, 3000);
            } else {
              alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลอีกครั้ง");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    inputCheckName($event) {
      var englishAlphabetAndWhiteSpace = /[A-Za-z | 0-9 กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์ ]/;
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
    }
  },
  computed: {
    filteredResources() {
      if (this.searchQuery) {
        return this.memberList.filter(item => {
          var re = item.phoneregis;
          if (!re) {
            re = "";
          }
          var phone = re.replace("66", "0");
          var citizenId = item.citizenid;
          var member_id = item.member_id;
          var firstname = item.firstname;
          if (citizenId == null) {
            citizenId = "";
          } else if (member_id == null) {
            member_id = "";
          } else if (firstname == null) {
            firstname = "";
          } else if (phone == null) {
            phone = "";
          }
          return (
            !this.searchQuery ||
            citizenId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            member_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            phone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            firstname.indexOf(this.searchQuery) > -1
          );
        });
      } else {
        return this.memberList;
        console.log("this.memberList", this.memberList);
      }
    },

    filteredResourcesBill() {
      // var dataBill = this.listBill.sort((a, b) => a.bill_no.timestamp - b.bill_no.timestamp).slice().reverse();
      if (this.searchBill) {
        return this.listBill.filter(items => {
          var billingNo = items.bill_no;
          var firstName = items.firstname;
          var lastName = items.lastname;

          if (billingNo == null) {
            billingNo = "";
          } else if (firstName == null) {
            firstName = "";
          } else if (lastName == null) {
            lastName = "";
          }
          // console.log('item',items);
          return (
            !this.searchBill ||
            items.bill_no.billing_no
              .toLowerCase()
              .indexOf(this.searchBill.toLowerCase()) > -1 ||
            items.firstname
              .toLowerCase()
              .includes(this.searchBill.toLowerCase()) ||
            items.lastname.toLowerCase().includes(this.searchBill.toLowerCase())
          );
        });
      } else {
        return this.listBill
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice()
          .reverse();
        //  return dataBill;
        // return this.listBill.bill_no.sort((a, b) => a.timestamp - b.timestamp);
      }
    }
  }
};
</script>
<style scoped>
.btn-primary {
  background-color: #1006df;
}
iframe {
  border: 0;
  /* margin-right: 340px;  */
  width: 700px;
  height: 450px;
}
.navbar {
  -webkit-box-shadow: 0 8px 6px -6px #999;
  -moz-box-shadow: 0 8px 6px -6px #999;
  box-shadow: 0 8px 6px -6px #999;

  /* the rest of your styling */
}
button {
  -webkit-box-shadow: 0 8px 6px -6px #999;
  -moz-box-shadow: 0 8px 6px -6px #999;
  box-shadow: 0 8px 6px -6px #999;

  /* the rest of your styling */
}
</style>


