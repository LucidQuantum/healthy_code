// 读取所有需要的数据
let data = {
    // 文字内容
    project: {
        value: '',
        validation: false
    },
    user_name: {
        value: '',
        validation: false
    },
    user_phone: {
        value: '',
        validation: false
    },
    // 图片内容
    healthy_code: {
        value: null,
        validation: false
    },
    travel_code: {
        value: null,
        validation: false
    },
    covid_test: {
        value: null,
        validation: true
    }
};
// 获取string值
const get_string_input = (field)=>{
    // 定位元素
    let element = document.getElementById(field);
    string_value = element.value;
    // 获取数值并验证
    data[field]['value'] = string_value;
    validate_string(field);
    // 检测是否能提交
    validate_all_fields();
};
const get_image_input = (field)=>{
    // 定位元素
    let element = document.getElementById(field);
    // 读取图片
    let image_file = element.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image_file);
    // 读取完成后，验证并储存
    reader.onload = function() {
        // 验证图片
        validate_image(field, image_file);
        // 将图片数据存储到data中
        image_data = reader.result;
        data[field]['value'] = image_file;
        // 更新UI，显示当前图片
        let image_element = document.getElementById(`${field}_image`);
        image_element.src = image_data;
        // 检测是否能提交
        validate_all_fields();
    };
};
const submit_data = ()=>{
    const formData = new FormData();
    let url = 'http://127.0.0.1:1234/submit';
    // formData.append('batch', data['project']['value']);
    formData.append('batch', '1');
    formData.append('username', data['user_name']['value']);
    formData.append('mobile', data['user_phone']['value']);
    formData.append('qr_code', data['healthy_code']['value']);
    formData.append('travel_code', data['travel_code']['value']);
    formData.append('check_up', data['covid_test']['value']);
    fetch(url, {
        method: 'POST',
        body: formData
    }).then((response)=>console.log(response)
    ).then((data1)=>{
        console.log('Success:', data1);
    }).catch((error)=>{
        console.error('Error:', error);
    });
// http.send(concat_data);
// http.onload = function (result) {
//     console.log(result);
// 请求结束后,在此处写处理代码
// };
// alert('数据提交成功！');
};
// Helper Function
const change_validation = (field, text, result)=>{
    let color = result == true ? 'green' : 'red';
    // 改变UI
    let label_element = document.getElementById(`${field}_label`);
    label_element.innerText = text;
    label_element.style.color = color;
    let input_element = document.getElementById(field);
    input_element.style.borderColor = color;
    // 改变数据
    data[field]['validation'] = result;
};
// 验证数据是否合法，验证完之后会在UI界面体现出来
const validate_string = (field)=>{
    value = data[field]['value'];
    switch(field){
        case 'user_name':
            if (value == '') change_validation(field, '2、请输入姓名', false);
            else if (value.length > 6) change_validation(field, '2、姓名不能超过6个字', false);
            else if (value.length == 1) change_validation(field, '2、姓名至少为2个字', false);
            else change_validation(field, '2、姓名（通过验证）', true);
            break;
        case 'user_phone':
            if (value[0] != '1') change_validation(field, '3、手机号必须以1开头', false);
            else if (value.length < 11) change_validation(field, '3、手机号长度太短', false);
            else if (value.length > 11) change_validation(field, '3、手机号长度太长', false);
            else change_validation(field, '3、手机号（通过验证）', true);
            break;
    }
};
const validate_image = (field, file)=>{
    max_size = 5120000;
    switch(field){
        case 'healthy_code':
            if (file.size > max_size) change_validation(field, '4、图片大小不能超过5MB', false);
            else change_validation(field, '4、健康码（通过）', true);
            break;
        case 'travel_code':
            if (file.size > max_size) change_validation(field, '5、图片大小不能超过5MB', false);
            else change_validation(field, '5、行程码（通过）', true);
            break;
        case 'covid_test_label':
            if (file.size > max_size) change_validation(field, '6、图片大小不能超过5MB', false);
            else change_validation(field, '6、核酸检测（通过）', true);
            break;
    }
};
const validate_all_fields = ()=>{
    console.log(data);
    final_validation = true;
    button_element = document.getElementById('submit_button');
    for(let field in data)if (data[field]['validation'] == false) final_validation = false;
    // 
    check_element = document.getElementById('check');
    if (!check_element.checked) final_validation = false;
    if (final_validation == true) {
        button_element.disabled = false;
        button_element.innerText = '提交数据';
    } else {
        button_element.disabled = true;
        button_element.innerText = '请填写所有必须项';
    }
};
// 数据初始化
get_string_input('project');
change_validation('project', '1、选择场次（通过）', true);
change_validation('covid_test', '6、(可选)上传48小时内【核酸检测】截图', true);

//# sourceMappingURL=index.672d4772.js.map
