<template>
  <div style="margin-top: 100px;" id="app">
    <div class="container">
      <b>รายชื่อสมาชิก</b>
       <table class="table table-striped">
      <thead style="background-color: #4169E1; color:white;">
        <tr>
          <th  style="text-align:center; ">
            <b style="font-size:18px;">เลขสมาชิก</b>
          </th>
          <th  style="text-align:center; ">
            <b style="font-size:18px;">บัตรประชาชน</b>
          </th>
          <th  style="text-align:center; ">
            <b style="font-size:18px;">ชื่อ</b>
          </th>
          <th  style="text-align:center; ">
            <b style="font-size:18px;">เบอร์โทร</b>
          </th>
          <th  style="text-align:center; ">
            <b style="font-size:18px;">ที่อยู่</b>
          </th>
          <th  style="text-align:center;  width:10%">
            <b style="font-size:18px;"></b>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-bind:key="item.id" v-for="(item, index) in filteredResources">
          <td scope="row" value="0" style="text-align:center;">{{ item.member_id }}</td>
          <td scope="row" value="0" style="text-align:center;">{{ item.citizenid }}</td>
          <td scope="row" value="0" style="text-align:left;">{{ item.aliasname }}</td>
          <td
            scope="row"
            value="0"
            style="text-align:center;"
          >{{ changePhone(item.phoneregis) }}</td>
          <td scope="row" value="0" style="text-align:left;">{{ item.address }}</td>
          <td scope="row" value="0" style="text-align:center;" >
             <button  type="button" class="btn btn-info" >ข้อมูล</button>
             <button  type="button" class="btn btn-success" v-on:click="getDataMember(index)">COD</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
<script>
export default {
  name: "app",

  mounted() {
    var that = this;
    var merid = this.$cookie.get("merid");
    const data = {
      branch_id: merid
    };
    axios
      .post(
        "https://apidev.whatitems.com/parcel/list/member/api",
        JSON.stringify(data)
      )
      .then(function(response) {
        that.memberList = response.data.listMember;
        console.log(that.memberList);
        that.$router.push({ path: "/listmember" });
        that.getDataBank();
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    getDataBank(index) {
      axios
        .get("https://apidev.whatitems.com/parcel/agent/bank/name")
        .then(resultsDataBank => {
          this.dataBank = resultsDataBank.data;
          // console.log("databank", this.dataBank);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
</style>