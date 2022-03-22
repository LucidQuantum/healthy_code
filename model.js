const is_chinese = (string) => {
    var chinese = /[^\u4e00-\u9fa5]/;
    return !chinese.test(string);
};

const is_number = (string) => {
    var reg = /^[0-9]*$/;
    return reg.test(string);
};

export default class Model {
    constructor() {
        this.name = '';
        this.phone = '';
        this.healthy = null;
        this.travel = null;
        this.covid = null;
    }

    get date() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let string;
        if (month <= 9) {
            string = `0${month}月${day}日`;
        } else {
            string = `${month}月${day}日`;
        }
        return string;
    }

    validate(id, value) {
        const MAX_IMAGE_SIZE = 5 * 1000 * 1024;

        let is_passed = false;
        let msg = '';

        switch (id) {
            case 'name':
                if (value.length == 0) {
                    is_passed = false;
                    msg = '姓名不能为空';
                } else if (!is_chinese(value)) {
                    is_passed = false;
                    msg = '姓名只能为汉字';
                } else if (value.length > 6) {
                    is_passed = false;
                    msg = '姓名不能超过6个字';
                } else if (value.length <= 1) {
                    is_passed = false;
                    msg = '姓名至少为2个字';
                } else {
                    this.name = value;
                    is_passed = true;
                    msg = '姓名（通过验证）';
                }
                break;
            case 'phone':
                if (value.length == 0) {
                    is_passed = false;
                    msg = '手机号不能为空';
                } else if (!is_number(value)) {
                    is_passed = false;
                    msg = '手机号只能为纯数字';
                } else if (value[0] != '1') {
                    is_passed = false;
                    msg = '手机号必须以1开头';
                } else if (value.length < 11) {
                    is_passed = false;
                    msg = '手机号长度少于11位';
                } else if (value.length > 11) {
                    is_passed = false;
                    msg = '手机号长度多于11位';
                } else {
                    this.phone = value;
                    is_passed = true;
                    msg = '手机号（通过验证）';
                }
                break;
            case 'healthy':
                if (!value) {
                    is_passed = false;
                    msg = '未上传图片';
                } else if (value.size > MAX_IMAGE_SIZE) {
                    is_passed = false;
                    msg = '图片大小不能超过5MB';
                } else {
                    this.healthy = value;
                    is_passed = true;
                    msg = '健康码（已上传）';
                }
                break;
            case 'travel':
                if (!value) {
                    is_passed = false;
                    msg = '未上传图片';
                } else if (value.size > MAX_IMAGE_SIZE) {
                    is_passed = false;
                    msg = '图片大小不能超过5MB';
                } else {
                    this.travel = value;
                    is_passed = true;
                    msg = '行程码（已上传）';
                }
                break;
            case 'covid':
                if (!value) {
                    is_passed = true;
                    msg = '核酸检测（未上传）';
                } else if (value.size > MAX_IMAGE_SIZE) {
                    is_passed = false;
                    msg = '图片大小不能超过5MB';
                } else {
                    this.covid = value;
                    is_passed = true;
                    msg = '核酸检测（已上传）';
                }
                break;
        }

        return {
            is_passed,
            msg,
        };
    }

    submit_data() {
        const formData = new FormData();
        let url = '/submit';

        formData.append('batch', this.date);
        formData.append('username', this.name);
        formData.append('mobile', this.phone);
        formData.append('qr_code', this.healthy);
        formData.append('travel_code', this.travel);
        formData.append('check_up', this.covid);

        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                response.json();
            })
            .then((response) => {
                if (response.status === 200) {
                    alert(`上传状态：${response.message}`);
                } else {
                    alert(`上传失败，错误码为${response.status}，错误内容：${response.message}`);
                }
            })
            .catch((error) => {
                console.log(error);
                alert(error.message);
            });
    }
}
