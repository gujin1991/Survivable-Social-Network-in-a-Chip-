/**
 * Created by Pan on 3/20/16.
 */

function PagingClass(pageSize,rows, messages, tbodyID) {
    this._pageSize = pageSize;
    this._rowCount = rows;
    this.pageCount = 0;
    this.pageIndex = 0;
    var content = $(tbodyID);
    this._curRows = messages;
    this._initPaging();
};

PagingClass.prototype._initPaging = function(){
    try{
        this._pageSize = (this._pageSize <= 0) || (this._pageSize>this._rowCount) ? this._rowCount : this._pageSize;
        this.pageCount = parseInt(this._rowCount%this._pageSize == 0 ? this._rowCount/this._pageSize : this._rowCount/this._pageSize+1);
    } catch(exception){}

    this._updateTableRows_();
};

PagingClass.prototype.nextPage = function(){
    if(this.pageIndex + 1 < this.pageCount){
        this.pageIndex += 1;
        this._updateTableRows_();
    }
};

PagingClass.prototype.prePage = function(){
    if(this.pageIndex >= 1){
        this.pageIndex -= 1;
        this._updateTableRows_();
    }
};

PagingClass.prototype._updateTableRows_ = function(){
    var iCurrentRowCount = this._pageSize * this.pageIndex;
    console.log(iCurrentRowCount);
    var iMoreRow = this._pageSize+iCurrentRowCount > this._rowCount ? this._pageSize+iCurrentRowCount - this._rowCount : 0;
    var tempRows = this._cloneRows_();
    content.html('');
    for(var i=iCurrentRowCount; i < this._pageSize+iCurrentRowCount-iMoreRow; i++){
        var message = tempRows[i];
        addMessage(message);
    }
    this._curRows = tempRows;
};

PagingClass.prototype._cloneRows_ = function(){
    var tempRows = [];
    for(var i=0; i<this._rowCount; i++){
        tempRows[i] = this._curRows[i];
    }
    return tempRows;
};

function addMessage(message) {
    console.log(message.status);
    var status = message.status;
    var logoName;
    if (status == 'OK') {
        logoName = "ok.png";
    } else if (status == 'Help') {
        logoName = "help.png";
    } else if (status == 'Emergency') {
        logoName = "emergency.png";
    } else if (status == 'Undefined') {
        logoName = "undefined.png";
    }
    var label;
    if (status == undefined) {
        label = '<div><span><span style="font-style: italic;">' + message.userName + '</span> says: <strong>'+ message.content +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
    } else if (message.fromUser === undefined) {
        label = '<div class="message">' +
            '<div class="messageHeader">' +
            '<span><span>' + message.userName + '</span>' +
            '<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
            '<div class="timestamp pull-right">' +
            '<i class="fa fa-clock-o fa-1"></i>' +
            '<small style="margin-left: 5px;">' + message.time + '</small>' +
            '</div>' +
            '</span>' +
            '</div>' +
            '<div class="messageBody"><strong>'+ message.content +' </strong></div></div>';
    } else {
        label = '<div class="message">' +
            '<div class="messageHeader">' +
            '<span><span>' + message.fromUser + '</span>' +
            '<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
            '<div class="timestamp pull-right">' +
            '<i class="fa fa-clock-o fa-1"></i>' +
            '<small style="margin-left: 5px;">' + message.time + '</small>' +
            '</div>' +
            '</span>' +
            '</div>' +
            '<div class="messageBody"><strong>'+ message.content +' </strong></div></div>';
    }
    var one = $(label);
    content.append(one);
}