const GREEN = '#4caf50';
const RED = '#fa5448';

class View {
    constructor() {
        this.validation_state = {
            name: false,
            phone: false,
            healthy: false,
            travel: false,
            covid: true,
        };
    }

    get all_varified() {
        let all_varified = true;
        for (const id in this.validation_state) {
            const is_passed = this.validation_state[id];
            if (!is_passed) {
                all_varified = false;
            }
        }
        return all_varified;
    }

    change_subtitle(text) {
        const subtitle_element = document.getElementById('subtitle');
        subtitle_element.innerText = text;
    }

    change_validation_state(id, message, is_passed) {
        // 将验证信息储存起来
        this.validation_state[id] = is_passed;

        // 改变UI
        const input_element = document.getElementById(id);
        const label_element = document.getElementById(`${id}_label`);

        let color = is_passed ? GREEN : RED;

        label_element.innerText = message;
        input_element.style = `background-color: ${color}; color: white; border: 2px solid ${color}`;
        label_element.style = `color: ${color}; font-weight: bold`;

        // 每当改变UI的时候，也要顺便检查按钮是否可以点击
        this.refresh_button();
    }

    refresh_button() {
        const button_element = document.getElementById('submit_button');
        if (!this.all_varified) {
            button_element.disabled = true;
            button_element.innerText = '有信息未验证通过';
        } else {
            button_element.disabled = false;
            button_element.innerText = '提交数据';
        }
    }

    refresh_image(id, image_file) {
        const image_element = document.getElementById(`${id}_image`);

        if (image_file) {
            const reader = new FileReader();
            reader.readAsDataURL(image_file);

            reader.onload = (e) => {
                const image_data = reader.result;

                image_element.src = image_data;
            };
        } else {
            image_element.src = '';
        }
    }
}

// 以上为view.js

const is_chinese = (string) => {
    var chinese = /[^\u4e00-\u9fa5]/;
    return !chinese.test(string);
};

const is_number = (string) => {
    var reg = /^[0-9]*$/;
    return reg.test(string);
};

class Model {
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
                console.log(value.size);
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
        console.log(this);

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
            .then((response) => response.json())
            .then((response) => {
                if (response.status == 200) {
                    alert(`上传状态：${response.message}，可关闭此页面，进入学校`);
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

// 以上为model.js

const model = new Model();
const view = new View();

// 获取今日日期，并显示
view.change_subtitle(`${model.date} - 健康码上传通道`);

// 实时检测输入框，并根据结果决定能否点击最后的按钮
const input_handler = (event) => {
    // 1、获取输入信息
    const id = event.target.id;
    let value = null;

    try {
        // 2、尝试读取图片，如果能读取，那么加载图片
        value = event.target.files[0];
        view.refresh_image(id, value);
    } catch (error) {
        if (error instanceof TypeError) {
            // 3、如果图片读不出来，说明是input输入框，那么value为string
            value = event.target.value;
        } else {
            throw error;
        }
    } finally {
        // 4、检验数据是否通过
        const result = model.validate(id, value);
        // 5、根据结果改变UI
        view.change_validation_state(id, result.msg, result.is_passed);
    }
};

const submit_data = () => {
    // const button_element = document.getElementById('submit_button');
    // button_element.innerText = '上传中……';
    model.submit_data();
};

// 监听用户输入
const name_element = document.getElementById('name');
name_element.addEventListener('input', input_handler);

const phone_element = document.getElementById('phone');
phone_element.addEventListener('input', input_handler);

const healthy_element = document.getElementById('healthy');
healthy_element.addEventListener('change', input_handler);

const travel_element = document.getElementById('travel');
travel_element.addEventListener('change', input_handler);

const covid_element = document.getElementById('covid');
covid_element.addEventListener('change', input_handler);

const submit_button = document.getElementById('submit_button');
submit_button.addEventListener('click', submit_data);
