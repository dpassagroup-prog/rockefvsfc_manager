import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePlayerPDF(player: any, parent: any) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Rockefvs FC Player Registration Form', 14, 22);

  doc.setFontSize(12);
  doc.text(`Registration Date: ${new Date().toLocaleDateString()}`, 14, 32);

  // Player details
  autoTable(doc, {
    startY: 40,
    head: [['Field', 'Value']],
    body: [
      ['Full Name', `${player.firstName} ${player.lastName}`],
      ['Date of Birth', new Date(player.dateOfBirth).toLocaleDateString()],
      ['Age Group', player.ageGroup],
      ['Phone', player.phone || 'N/A'],
      ['Address', player.address || 'N/A'],
      ['Place of Birth', player.placeOfBirth || 'N/A'],
      ['MySAFA ID', player.mysafaId || 'N/A'],
      ['National ID', player.nationalId || 'N/A'],
      ['Nationality', player.nationality || 'N/A'],
      ['Previous Club', player.previousClub || 'N/A'],
      ['Position', player.position || 'N/A'],
      ['Emergency Contact', `${player.emergencyContactName || 'N/A'} (${player.emergencyContactPhone || 'N/A'})`],
      ['Medical Notes', player.medicalNotes || 'N/A'],
    ],
    theme: 'striped',
  });

  // Parent details
  let finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Parent/Guardian Information', 14, finalY);
  autoTable(doc, {
    startY: finalY + 5,
    head: [['Field', 'Value']],
    body: [
      ['Name', parent.fullName],
      ['Email', parent.email],
      ['Phone', parent.phone || 'N/A'],
      ['Address', parent.address || 'N/A'],
    ],
    theme: 'striped',
  });

  // Consent
  finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Consent & Terms', 14, finalY);
  autoTable(doc, {
    startY: finalY + 5,
    head: [['Item', 'Consent']],
    body: [
      ['Photos', player.consentPhotos ? 'Yes' : 'No'],
      ['Videos', player.consentVideos ? 'Yes' : 'No'],
      ['Travel', player.consentTravel ? 'Yes' : 'No'],
      ['Terms Accepted', player.termsAccepted ? 'Yes' : 'No'],
      ['Parent Signature', player.parentSignature || 'N/A'],
    ],
    theme: 'striped',
  });

  doc.save(`player_${player.firstName}_${player.lastName}_registration.pdf`);
}