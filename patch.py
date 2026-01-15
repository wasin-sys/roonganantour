
import os

file_path = 'src/App.jsx'
start_line = 2161  # 1-based, first line to remove
end_line = 2373    # 1-based, last line to remove

new_content = r"""                    <div className="space-y-8">
                      {bookingGroups.map(group => {
                        const groupPax = bookingPaxList.filter(p => p.groupId === group.id);
                        const isTarget = targetGroupId === group.id;
                        return (
                          <div key={group.id} className={`border-2 rounded-xl overflow-hidden transition-all ${isTarget ? 'border-indigo-400 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-indigo-100 bg-indigo-50/10'}`}>
                            <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-indigo-100">
                              <div className="flex items-center gap-3">
                                <Users className="text-indigo-600" />
                                <h3 className="font-bold text-indigo-900">{group.name}</h3>
                                <span className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-full font-bold border border-indigo-200">{groupPax.length} ท่าน</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setTargetGroupId(group.id); setShowCustomerSearch(true); }} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-1">
                                  <Plus size={12} /> เพิ่มคน
                                </button>
                                <button onClick={() => setBookingGroups(prev => prev.filter(g => g.id !== group.id))} className="p-1.5 text-indigo-300 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              {groupPax.length === 0 ? (
                                <div className="text-center py-4 text-indigo-300 border-2 border-dashed border-indigo-200 rounded-lg text-indigo-300 text-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition" onClick={() => { setTargetGroupId(group.id); setShowCustomerSearch(true); }}>
                                  + กดที่นี่เพื่อเพิ่มคนเข้ากลุ่ม
                                </div>
                              ) : groupPax.map((p, i) => renderPaxCard(p, i + 1))}
                            </div>
                          </div>
                        );
                      })}

                      {(() => {
                         const indivPax = bookingPaxList.filter(p => !p.groupId);
                         return (
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                  <UserIcon className="text-gray-500" />
                                  <h3 className="font-bold text-gray-700">ผู้เดินทางอิสระ</h3>
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">{bookingPaxList.filter(p => !p.groupId).length} ท่าน</span>
                                </div>
                                <button onClick={() => { setTargetGroupId(null); setShowCustomerSearch(true); }} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-700 transition flex items-center gap-1">
                                  <Plus size={12} /> เพิ่มคนเดี่ยว
                                </button>
                              </div>
                              <div className="p-4 space-y-3">
                                {indivPax.length === 0 ? (
                                  <div className="text-center py-6 text-gray-400 text-sm italic">ไม่มีผู้เดินทางในหมวดนี้</div>
                                ) : indivPax.map((p, i) => renderPaxCard(p, i + 1))}
                              </div>
                            </div>
                         );
                      })()}

                      <div className="pt-4 border-t border-gray-200 bg-white">
                        <div className="flex justify-between text-lg font-bold mt-2 text-[#03b8fa] mb-4">
                          <span>ยอดรวมโดยประมาณ:</span>
                          <span>฿{(selectedPaxForBooking.reduce((sum, paxId) => {
                            const pax = bookingPaxList.find(c => c.id === paxId);
                            if (!pax) return sum;
                            const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                            const paid = pax.paymentStatus === 'paid' ? total : (pax.paidAmount || 0);
                            return sum + (total - paid);
                          }, 0)).toLocaleString()}</span>
                        </div>
                        <button
                          className="w-full bg-[#03b8fa] text-white py-3 rounded-lg font-bold hover:bg-[#0279a9] shadow-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                          disabled={selectedPaxForBooking.length === 0}
                          onClick={() => setIsBookingConfirmationModalOpen(true)}
                        >
                          ดำเนินการวางบิล ({selectedPaxForBooking.length} ท่าน)
                        </button>
                      </div>
                    </div>
"""

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Python list slicing is 0-based. 
# lines 1..2160 -> list[0:2160] (indices 0 to 2159)
# lines 2374..End -> list[2373:] (indices 2373 to end)

before = lines[:start_line-1]
after = lines[end_line:]

final_content = "".join(before) + new_content + "\n" + "".join(after)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully successfully patched App.jsx")
