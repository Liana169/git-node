const createPostForm = document.querySelector('#create_post_form');
const updatePostForm = document.querySelector('#update_post_form');
const deletePostForm = document.querySelector('#delete_post_form');

const handlerError = (e) => {
    const errors = e?.response?.data?.errors;
    if (errors) {
        const errorSpans = document.querySelectorAll('span[id^="error_"]');
        errorSpans.forEach(span => span.innerText = '');

        for (const [key, value] of Object.entries(errors)) {
            if (typeof value !== 'object') {
                const span = document.querySelector(`span#error_${key}`);
                if (span) span.innerText = value;
            } else {
                for (const [key2, value2] of Object.entries(value)) {
                    const span = document.querySelector(`span#error_${key2}`);
                    if (span) span.innerText = value2;
                }
            }
        }
        return { data: errors };
    }
    return { data: null };
};

if (createPostForm) {
    createPostForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());

        const { data } = await axios({
            method: 'post',
            url: '/posts',
            data: {
                ...formObject
            }
        }).catch(handlerError);

        console.log(data);
    }
}


if (updatePostForm) {
    updatePostForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        const postId = formObject.id;
        const { data } = await axios({
            method: 'put',
            url: `/posts/${postId}`,
            data: {
                ...formObject
            }
        }).catch(handlerError);

        console.log(data);
    }
}


if (deletePostForm) {
    deletePostForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        const postId = formObject.id;

        const { data } = await axios({
            method: 'delete',
            url: `/posts/${postId}`
        }).catch(handlerError);

        console.log(data);
    }
}

