<template>
  <div style="margin : 0" id="app">
    <div v-if="view == 1">
      <div class="login">
        <label>Username</label>
        <input
          v-model="username"
          class="inputLogin"
          placeholder="Username"
          autocomplete="false"
        />
        <label>Password</label>
        <input
          v-model="password"
          class="inputLogin"
          placeholder="Password"
          type="password"
          autocomplete="false"
        />
        <button v-on:click="chechValidateLogin" class="btnLogin">
          <!-- <router-link to="/"> -->
          <label style="color:white;">LOGIN</label>
          <!-- </router-link> -->
        </button>
      </div>
    </div>

    <div v-if="view == 2">
      <Menu v-model="dataLogin"></Menu>
    </div>
  </div>
</template>

<script>
const queryString = require("query-string");
import Menu from "./components/Menu";
import QueryString from "query-string";

export default {
  name: "app",
  components: {
    Menu
  },
  data: function() {
    return {
      view: 1,
      username: "",
      password: "",
      dataLogin: [],
      showNav: false,
      sideBar: false,
      mername: "",
      merid: "",
      usernamelogin: "",
      userid: "",
      authenlevel: ""
    };
  },

  mounted: function() {
    var dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
    console.log("dataLogin",dataLogin);
    if (dataLogin != null) {
      this.view = 2;
      // this.usernamelogin = this.$cookie.get("username");
      // this.userid = this.$cookie.get("userid");
      // this.mername = this.$cookie.get("mername");
      // this.merid = this.$cookie.get("merid");
      // this.authenlevel = this.$cookie.get("authenlevel");
    }
  },

  methods: {
    chechValidateLogin() {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)$/;
      var phone = /^\d{10}$/;
      if (this.username.match(mailformat) || this.username.match(phone)) {
        this.onClickLogin();
        return true;
      } else {
        this.$dialogs.alert("กรุณากรอก username ให้ถูกต้อง");
        return false;
      }
    },
    onClickLogin() {
      const data = {
        apikey: "XbOiHrrpH8aQXObcWj69XAom1b0ac5eda2b",
        uname: this.username,
        password: this.password
      };
      var qs = queryString.stringify(data);
      let config = {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      };
      axios
        .post(
          "https://www.945holding.com/webservice/restful/authen/v11/userauthen",
          qs,
          config
        )
        .then(response => {
          if (response.data[0] == "user not found") {
            alert("ไม่มีข้อมูลในระบบ");
          } else {
            this.dataLogin = response.data;
            // console.log("dataLogin", this.dataLogin);
            if (
              response.data.authencheck == "pass" &&
              response.data.userstatus == "active"
            ) {
              // console.log("dataLogin", this.dataLogin);
              var dataLogin = this.dataLogin;

              localStorage.setItem("dataLogin",JSON.stringify(dataLogin));

              // this.$cookie.set("username", response.data.username, 1);
              // this.$cookie.set("userid", response.data.userid, 1);
              // this.$cookie.set("mername", response.data.mername, 1);
              // this.$cookie.set("merid", response.data.merid, 1);
              // this.$cookie.set("authenlevel", response.data.authenlevel, 1);
              // this.usernamelogin = this.$cookie.get("username");
              // this.userid = this.$cookie.get("userid");
              // this.mername = this.$cookie.get("mername");
              // this.merid = this.$cookie.get("merid");
              // this.authenlevel = this.$cookie.get("authenlevel");
              // login pass //
              this.view = 2;
              // this.$router.push({path: '/parcel'});
              window.location.href = "/parcel";
              // window.location.reload();
            } else {
              this.$dialogs.alert(
                "ไม่สามารถใช้ username/password ได้ในตอนนี้, กรุณาติดต่อเจ้าหน้าที่"
              );
              this.username = "";
              this.password = "";
            }
          }
        })
        .catch(err => {
          console.log("ERROR: ====", err);
        });
    },
  }
};
</script>

<style scoped>
* {
  font-family: "Prompt", sans-serif;
}
a {
  color: #337ab7;
}

.padded {
  padding-left: 50px;
  padding-right: 50px;
}

#sidebar a {
  color: #bfbfbf;
}

#sidebar a:hover {
  color: #337ab7;
  text-decoration: none;
}

#sidebar hr {
  border-color: #444;
}

html {
  overflow: hidden;
  overflow-y: auto;
}

html,
body {
  height: 100%;
  min-height: 100%;
  padding: 0;
  margin: 0;
}

body {
  /* overflow: hidden; */
  position: relative;
  height: auto;
}

.dashboard-btn {
  float: left;
  margin-right: 20px;
  padding: 8px 0;
  margin: 11px 15px 0 0;
  background-color: transparent;
}

.dashboard-btn span {
  margin-bottom: 3px;
  display: block;
  width: 21px;
  height: 2px;
  border-radius: 0px;
  background-color: #7b7777;
}
/* dashboard sidebar */

#sidebar {
  box-sizing: border-box;
  border-right: 1px solid #333;
  background-color: #383838;
  width: 225px;
  height: 100%;
  position: fixed;
  top: 0px;
  left: -225px;
  bottom: 0;
  z-index: 1;
  -moz-box-shadow: 1px 0 1px rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 1px 0 1px rgba(0, 0, 0, 0.07);
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.07);
  -moz-transition: -moz-transform 0.3s ease-in-out 0s;
  -o-transition: -o-transform 0.3s ease-in-out 0s;
  -webkit-transition: -webkit-transform 0.3s ease-in-out;
  -webkit-transition-delay: 0s;
  transition: transform 0.3s ease-in-out 0s;
  -moz-backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.sidebar-visible {
  -ms-transform: translate(225px, 0);
  -webkit-transform: translate(225px, 0);
  transform: translate(225px, 0);
}

.sidebar-hidden {
  -ms-transform: translate(0, 0);
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}

#sidebar .sidebar-body {
  padding-left: 35px;
  padding-right: 15px;
  padding-top: 12px;
  position: absolute;
  overflow: auto;
  overflow-x: hidden;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}

#sidebar .sidebar-body a {
  font-size: 1em;
  display: inline-block;
  padding: 2px 0;
}

#sidebar .sidebar-body h5 {
  font-size: 12px;
  text-transform: uppercase;
  display: inline-block;
  color: #777;
}

#sidebar .sidebar-close-btn {
  color: #b9b9b9;
  background: transparent;
  padding: 2px 12px;
  border: 0;
  font-size: 19px;
  font-weight: 300;
  float: right;
}

#sidebar .sidebar-close-btn:hover {
  background-color: #585858;
  color: #337ab7;
}

.login {
  width: 350px;
  background: white;
  /*meletakkan form ke tengah*/
  margin: auto;
  margin-top: 200px;
  padding: 30px 20px;
}

.inputLogin {
  /*membuat lebar form penuh*/
  text-align: center;

  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  font-size: 11pt;
  margin-bottom: 20px;
}

.btnLogin {
  background: skyblue;
  color: white;
  font-size: 11pt;
  width: 100%;
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
}
</style>
