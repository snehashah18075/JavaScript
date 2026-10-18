/* Practical 12: DOM, jQuery events, localStorage and AJAX */
$(function () {
  const KEY = 'practical12_taskflow_v1';
  const starter = [
    {id:1,text:'Revise JavaScript DOM manipulation',priority:'high',done:false},
    {id:2,text:'Complete web technology practical',priority:'medium',done:false},
    {id:3,text:'Review jQuery event handling',priority:'low',done:true}
  ];
  let tasks;
  try { const saved=JSON.parse(localStorage.getItem(KEY)); tasks=Array.isArray(saved)?saved:starter; }
  catch (_) { tasks=starter; }
  let filter='all';
  $('#today').text(new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}));
  function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks));$('#storageStatus').text('Saved locally');}catch(e){$('#storageStatus').text('Storage unavailable');}}
  function toast(msg){$('#toast').stop(true,true).text(msg).fadeIn(180).delay(1900).fadeOut(300);}
  function render(){
    const done=tasks.filter(t=>t.done).length;
    $('#total').text(tasks.length);$('#completed').text(done);$('#pending').text(tasks.length-done);
    const pct=tasks.length?Math.round(done/tasks.length*100):0;
    $('#percent').text(pct+'%');$('#progress').css('width',pct+'%');
    const q=$('#search').val().trim().toLowerCase();
    const shown=tasks.filter(t=>(filter==='all'||(filter==='completed'?t.done:!t.done))&&t.text.toLowerCase().includes(q));
    const list=$('#taskList').empty();$('#empty').prop('hidden',shown.length!==0);
    shown.forEach(t=>{
      const li=$('<li>').addClass('task').toggleClass('done',t.done).attr('data-id',t.id);
      const check=$('<input type="checkbox" class="check" aria-label="Mark task complete">').prop('checked',t.done);
      const name=$('<span class="task-name">').text(t.text);
      const tag=$('<span class="tag">').addClass(t.priority).text(t.priority);
      const edit=$('<button class="iconbtn edit" title="Edit task" aria-label="Edit task">').text('✎');
      const del=$('<button class="iconbtn delete" title="Delete task" aria-label="Delete task">').text('×');
      li.append(check,name,tag,edit,del);list.append(li);
    });
  }
  $('#taskForm').on('submit',function(e){e.preventDefault();const text=$('#taskInput').val().trim();if(!text)return;tasks.unshift({id:Date.now()+Math.random(),text,priority:$('#priority').val(),done:false});$('#taskInput').val('').focus();save();render();toast('Task added successfully');});
  $('#taskList').on('change','.check',function(){const t=tasks.find(t=>String(t.id)===String($(this).closest('li').data('id')));if(t){t.done=this.checked;save();render();toast(t.done?'Task completed!':'Task marked pending');}});
  $('#taskList').on('click','.delete',function(){const id=$(this).closest('li').data('id');tasks=tasks.filter(t=>String(t.id)!==String(id));save();render();toast('Task deleted');});
  $('#taskList').on('click','.edit',function(){const id=$(this).closest('li').data('id');const t=tasks.find(t=>String(t.id)===String(id));if(!t)return;const value=prompt('Edit task:',t.text);if(value!==null&&value.trim()){t.text=value.trim().slice(0,100);save();render();toast('Task updated');}});
  $('.filter').on('click',function(){$('.filter').removeClass('active');$(this).addClass('active');filter=$(this).data('filter');render();});
  $('#search').on('input',render);
  $('#clearDone').on('click',function(){const count=tasks.length;tasks=tasks.filter(t=>!t.done);save();render();toast(count===tasks.length?'No completed tasks':'Completed tasks cleared');});
  const fallback=[{content:'The secret of getting ahead is getting started.',author:'Mark Twain'},{content:'It always seems impossible until it is done.',author:'Nelson Mandela'}];
  let fallbackIndex=0;
  function loadQuote(){
    $('#loadQuote').prop('disabled',true).text('Loading...');$('#quote').text('Fetching a fresh quote...');$('#author').text('');
    $.ajax({url:'https://dummyjson.com/quotes/random',method:'GET',dataType:'json',timeout:8000})
      .done(function(data){$('#quote').text('“'+data.quote+'”');$('#author').text('— '+data.author);toast('Quote loaded using AJAX');})
      .fail(function(){const q=fallback[fallbackIndex++%fallback.length];$('#quote').text('“'+q.content+'”');$('#author').text('— '+q.author+' (offline fallback)');toast('API unavailable; showing offline quote');})
      .always(function(){$('#loadQuote').prop('disabled',false).text('↻ Fetch new quote');});
  }
  $('#loadQuote').on('click',loadQuote);render();save();loadQuote();
});
