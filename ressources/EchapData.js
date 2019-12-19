let jsonQuery = require('json-query')
const multer  = require('multer')
const upload = multer({});

class EchapData {

    arrEchap(doc,req){
        for(let i = 0; i<doc.length;i++){
            try {if(!doc[i].toDisplay["profile"]){delete doc[i];continue}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["description"]){delete doc[i].description}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["profilePicture"]){doc[i].profilePicture = "/img/defaultProfile.jpg"}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["studyYear"]){delete doc[i].studyYear}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["option"]){delete doc[i].option}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["topSkills"]){delete doc[i].topSkills}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["otherSkills"]){delete doc[i].otherSkills}}
            catch(error){console.log(error)}

            try {if(!doc[i].toDisplay["links"]){delete doc[i].links}}
            catch(error){console.log(error)}

        }
        //console.log(doc)
        return doc.filter((el) => {return el != null});
    }

    jsonEchap(doc,req){
        try {if(!doc.toDisplay["profile"]){return null}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["description"]){delete doc.description}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["profilePicture"]){doc.profilePicture = "/img/defaultProfile.jpg"}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["studyYear"]){delete doc.studyYear}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["option"]){delete doc.option}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["topSkills"]){delete doc.topSkills}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["otherSkills"]){delete doc.otherSkills}}
        catch(error){console.log(error)}

        try {if(!doc.toDisplay["links"]){delete doc.links}}
        catch(error){console.log(error)}


        return doc
    }

    formEchap(req, student, data){
        let toUpdate = {}

        if(req.file){toUpdate.profilePicture = "data:image/jpeg;base64," + req.file.buffer.toString('base64')}
        if(req.body.description !== '' && req.body.description !== student.description){toUpdate.description = req.body.description}
        if(req.body.studyYear !== student.studyYear){toUpdate.studyYear = req.body.studyYear}
        //option
        if(req.body.minor !== student.option && (req.body.studyYear == "Bac2" || req.body.studyYear == "Bac3") ){toUpdate.option = req.body.minor}
        if(req.body.master !== student.option && (req.body.studyYear == "M1" || req.body.studyYear == "M2") ){toUpdate.option = req.body.master}

        //public ?
        toUpdate.toDisplay = {}
        if(req.body['toShow-profile'] == "on"){toUpdate.toDisplay.profile = true}
        else{toUpdate.toDisplay.profile = false}

        if(req.body['toShow-description'] == "on"){toUpdate.toDisplay.description = true
        }else{toUpdate.toDisplay.description = false}

        if(req.body['toShow-profilePicture'] == "on"){toUpdate.toDisplay.profilePicture = true
        }else{toUpdate.toDisplay.profilePicture = false}

        if(req.body['toShow-studyYear'] == "on"){toUpdate.toDisplay.studyYear = true
        }else{toUpdate.toDisplay.studyYear = false}

        if(req.body['toShow-option'] == "on"){toUpdate.toDisplay.option = true
        }else{toUpdate.toDisplay.option = false}

        if(req.body['toShow-topSkills'] == "on"){toUpdate.toDisplay.topSkills = true
        }else{toUpdate.toDisplay.topSkills = false}

        if(req.body['toShow-otherSkills'] == "on"){toUpdate.toDisplay.otherSkills = true
        }else{toUpdate.toDisplay.otherSkills = false}

        if(req.body['toShow-links'] == "on"){toUpdate.toDisplay.links = true
        }else{toUpdate.toDisplay.links = false}

        //top skills
        toUpdate.topSkills = {}
        //top skill 1
        toUpdate.topSkills['1'] = {}
        if(req.body.topSkillLang1 !== undefined && req.body.topSkillPour1 !== undefined){
            let tmpVal = jsonQuery('[name=' + req.body.topSkillLang1 + ']', {
                data: data
            }).value
            toUpdate.topSkills['1'].name = tmpVal.name
            toUpdate.topSkills['1'].icon = tmpVal.icon
            toUpdate.topSkills['1'].color1 = tmpVal.color1
            toUpdate.topSkills['1'].color2 = tmpVal.color2
            toUpdate.topSkills['1'].pourcent = req.body.topSkillPour1
        }

        //if no change
        if(Object.keys(toUpdate.topSkills['1']).length === 0){ delete toUpdate.topSkills['1']}

        //top skill 2
        toUpdate.topSkills['2'] = {}
        if(req.body.topSkillLang2 !== undefined && req.body.topSkillPour2 !== undefined){
            let tmpVal = jsonQuery('[name=' + req.body.topSkillLang2 + ']', {
                data: data
            }).value
            toUpdate.topSkills['2'].name = tmpVal.name
            toUpdate.topSkills['2'].icon = tmpVal.icon
            toUpdate.topSkills['2'].color1 = tmpVal.color1
            toUpdate.topSkills['2'].color2 = tmpVal.color2
            toUpdate.topSkills['2'].pourcent = req.body.topSkillPour2
        }

        //if no change
        if(Object.keys(toUpdate.topSkills['2']).length === 0){ delete toUpdate.topSkills['2']}

        //top skill 3
        toUpdate.topSkills['3'] = {}
        if(req.body.topSkillLang3 !== undefined && req.body.topSkillPour3 !== undefined){
            let tmpVal = jsonQuery('[name=' + req.body.topSkillLang3 + ']', {
                data: data
            }).value
            toUpdate.topSkills['3'].name = tmpVal.name
            toUpdate.topSkills['3'].icon = tmpVal.icon
            toUpdate.topSkills['3'].color1 = tmpVal.color1
            toUpdate.topSkills['3'].color2 = tmpVal.color2
            toUpdate.topSkills['3'].pourcent = req.body.topSkillPour3
        }

        //if no change
        if(Object.keys(toUpdate.topSkills['3']).length === 0){ delete toUpdate.topSkills['3']}

        //delete top skills if no change
        if(Object.keys(toUpdate.topSkills).length === 0){ delete toUpdate.topSkills}

        //others skill
        let tmpTabDescri = req.body.otherSkills.trim().split(";")
        for(let i =0; i< tmpTabDescri.length;i++){tmpTabDescri[i] =  tmpTabDescri[i].trim()}
        while (tmpTabDescri.indexOf('') !== -1) {tmpTabDescri.splice(tmpTabDescri.indexOf(''), 1);}
        toUpdate.otherSkills = tmpTabDescri.slice(0, 19)
        if(toUpdate.otherSkills.length === 0){ delete toUpdate.otherSkills}

        //contacts links
        toUpdate.links = {}
        let presetsLinks = jsonQuery('[*type=social]', {data: data}).value
        for(let i =0; i < presetsLinks.length; i++){
            toUpdate.links[presetsLinks[i].name] = {}
            if(req.body[presetsLinks[i].name + "-username"] !== undefined && req.body[presetsLinks[i].name + "-username"] !== ''){toUpdate.links[presetsLinks[i].name].username =  req.body[presetsLinks[i].name + "-username"]}
            if(req.body[presetsLinks[i].name + "-username"] !== undefined && req.body[presetsLinks[i].name + "-username"] !== '' && req.body[presetsLinks[i].name + "-link"] !== undefined && req.body[presetsLinks[i].name + "-link"] !== ''){toUpdate.links[presetsLinks[i].name].link =  req.body[presetsLinks[i].name + "-link"]}
            if(req.body[presetsLinks[i].name + "-username"] !== undefined && req.body[presetsLinks[i].name + "-username"] !== '' && req.body[presetsLinks[i].name + "-data"] !== undefined && req.body[presetsLinks[i].name + "-data"] !== ''){toUpdate.links[presetsLinks[i].name].data =  req.body[presetsLinks[i].name + "-username"] + presetsLinks[i].dataSep + req.body[presetsLinks[i].name + "-data"]}
            if(req.body[presetsLinks[i].name + "-username"] !== undefined && req.body[presetsLinks[i].name + "-username"] !== ''){toUpdate.links[presetsLinks[i].name].icon = presetsLinks[i].icon} // add icon
            if(Object.keys(toUpdate.links[presetsLinks[i].name]).length === 0){ delete toUpdate.links[presetsLinks[i].name]}
        }
        if(Object.keys(toUpdate.links).length === 0){ delete toUpdate.links}

        return toUpdate
    }

}

module.exports = EchapData
