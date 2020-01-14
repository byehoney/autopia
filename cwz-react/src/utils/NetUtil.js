
const url = 'https://service.chetuobang.com';
// const url = 'https://testservice.chetuobang.com';
export default class NetUtil {
    static get(uri) {
        return new Promise(function (resolve, reject) {
            fetch(url+uri)
                .then(response => {
                    if(response.status==200){
                        return response.json()
                    }else{
                        return {message:'请求错误'}
                    }
                })
                .then(data => {
                    resolve(data);
                }).catch(function (ex) {
                    console.log(ex)
                });
        });
    }
    static post(uri, params) {
        uri = url + uri;
        let init = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };
        return new Promise(function (resolve, reject) {
            fetch(uri, init)
                .then(response => {
                    if(response.status==200){
                        return response.json()
                    }else{
                        return {message:'请求错误'}
                    }
                }).then(data => {
                    resolve(data);
                }).catch(function (ex) {
                   console.log(ex)
                    // Alert.alert('错误提示', '网络链接出错');
                    // window.location='/my';
                });
        });
    }
    
}