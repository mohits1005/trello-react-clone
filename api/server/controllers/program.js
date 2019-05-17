var { Program } = require('../models/program');
var { ProgramModule } = require('../models/program_module');

var { UserSession } = require('../models/user_session');

const findProgram = (program_id) => {
    return new Promise((resolve, reject) => {
        Program.findOne({ 'program_id': program_id }).then((program) => {
            resolve(program);
        }, (e) => {
            reject(e);
        });
    })
}
const getProgramData = async (program_id) => {
        const program = await findProgram(program_id).catch(
            error => {
                throw error;
            }
        )
        const status = 1;
        return { status, program };
}
const userModuleSession = (uid, track_id) => {
    return new Promise((resolve, reject) => {
        UserSession.find({ 'uid': uid, "module_id": new RegExp('^'+track_id+'') },
            [],
            { limit: 1, sort: { last_t: -1 } }
        ).then((sessions) => {
            if (sessions[0] && sessions[0]['module_id'])
            {
                var module_data = sessions[0];
                var module_id = module_data.module_id;
                resolve(module_id)
            }
            else
            {
                reject();
            }
        }, (e) => {
            reject(e);
        });
    })
}
const moduleCompletionMatrix = (uid, module_ids) => {
    module_completion_matrix = {}
    return new Promise((resolve, reject) => {
        UserSession.find({ 'uid': uid, "module_id": {$in: module_ids}},)
        .then((output) => {
            for(key in output){
                val = output[key];
                if (val['u_t_s'] && val['u_t_s'] == 1){
                    module_completion_matrix[val['module_id']] = 1;
                }
                else if (val['u_t_s']){
                    module_completion_matrix[val['module_id']] = -1;
                }
            }
            resolve(module_completion_matrix);
        }, (e) => {
            reject(e);
        });
    })
}
const getModuleData = (module_id) => {
    return new Promise((resolve, reject) => {
        ProgramModule.find({ 'module_id': module_id})
        .then((modules) => {
            var module_name = modules[0].module_name;
            var module_id = modules[0].module_id;
            resolve({module_id, module_name})
        }, (e) => {
            reject(e);
        });
    })
}
const find_first_child_module = (module_list) => {
    for(k9 in module_list) {
        v9 = module_list[k9]
        if (v9['rec_time'] !== '' && parseFloat(v9['rec_time']) > 0) {
            if (v9['child'] && v9['child'].length > 0)
                return find_first_child_module(v9['child']);
            else
            {
                g_first_module = {"module_id":v9['module_id'], "module_name":v9['module_name']};
                return g_first_module;
            }
        } else if (v9['child'] && v9['child'].length > 0)
            find_first_child_module(v9['child']);
    }
    return 1;
}
const find_child_module = (g_module_data, module_id, module_child) => {
    for(i=0;i<module_child.length;i++){
        curr_module = module_child[i];
        module_id = curr_module.module_id;
        child = curr_module.child
        if (child && child.length > 0){
            find_child_module(g_module_data, module_id, child)
        }
        else{
            g_module_data.push(module_id);
        }
    }
}
const getClientTrackData =  async (token_params, track_id) => {
    const program = await findProgram(track_id);
    const uid = token_params.uid;
    var currentlylearning_flag = 1;
    var currently_learning = {};
    var module_id = '';
    module_id = await userModuleSession(uid, track_id).catch(
        error => {
            currentlylearning_flag = 0
        }
    )
    var module_name = '';
    if (currentlylearning_flag){
        var moduleData = await getModuleData(module_id);
        currently_learning = moduleData;
        currently_learning["continue"] = 1;
    }
    else{
        var first_module = find_first_child_module(program['modules']);
        currently_learning = first_module;
        currently_learning["continue"] = 0;
    }
    // module wise progress
    var g_module_data;
    g_module_data = [];
    for(key in program['modules']) {
        val = program['modules'][key]
        if (val['child'] && val['child'].length>0)
        {
            find_child_module(g_module_data, val['module_id'], val['child']);
        }
    }
    var module_completion_list = []
    
    if(g_module_data.length > 0){
        module_completion_list = await moduleCompletionMatrix(uid, g_module_data);
    }
    for (i = 0; i < g_module_data.length; i++) {
        if (!module_completion_list[g_module_data[i]])
            module_completion_list[g_module_data[i]] = 0;
    }
    const status = 1;
    return { status, module_id, module_name, program, currently_learning, g_module_data, module_completion_list };
}
module.exports = {
    getProgramData,
    getClientTrackData
};