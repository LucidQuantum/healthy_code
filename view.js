const GREEN = '#4caf50';
const RED = '#fa5448';

export default class View {
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
