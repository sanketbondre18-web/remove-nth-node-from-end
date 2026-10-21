import { BookOpen, Code2, Clock, HardDrive, Lightbulb, FileCode } from 'lucide-react';

export default function LearningSection() {
  return (
    <section className="space-y-6 animate-slide-up">
      {/* Problem Statement */}
      <Card
        icon={<BookOpen size={16} />}
        title="Problem Statement"
        id="section-problem"
      >
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          Given the <code className="code-inline">head</code> of a singly linked list, remove the{' '}
          <strong>N<sup>th</sup></strong> node from the <em>end</em> of the list
          and return the new head.
        </p>

        <div className="bg-bg-primary border border-border rounded-lg p-4 mb-3">
          <p className="text-xs font-semibold text-text-muted mb-1">Example</p>
          <p className="text-sm text-text-secondary font-mono">
            Input:&nbsp; 1 → 2 → 3 → 4 → 5, &nbsp;N = 2
          </p>
          <p className="text-sm text-text-secondary font-mono">
            Output: 1 → 2 → 3 → 5
          </p>
          <p className="text-xs text-text-muted mt-2">
            The 2nd node from the end is <strong>4</strong>, so it is removed.
          </p>
        </div>

        <div className="bg-bg-primary border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-text-muted mb-1">Constraints</p>
          <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
            <li>1 ≤ list size ≤ 30</li>
            <li>0 ≤ Node.val ≤ 100</li>
            <li>1 ≤ N ≤ list size</li>
          </ul>
        </div>
      </Card>

      {/* Algorithm Explanation */}
      <Card
        icon={<Lightbulb size={16} />}
        title="Algorithm — Two-Pointer Technique"
        id="section-algorithm"
      >
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          The key insight is that the N<sup>th</sup> node from the end is also the{' '}
          <strong>(L − N + 1)<sup>th</sup></strong> node from the start, where L is the
          list length. Instead of computing L first (two passes), we use{' '}
          <strong>two pointers</strong> to find the target in a single pass:
        </p>

        <ol className="text-sm text-text-secondary space-y-2.5 list-decimal list-inside leading-relaxed">
          <li>
            <strong>Create a dummy node</strong> that points to <code className="code-inline">head</code>.
            This eliminates special-case handling when the head itself must be deleted
            (i.e., when N equals the list size).
          </li>
          <li>
            Place both <code className="code-inline">slow</code> and{' '}
            <code className="code-inline">fast</code> at the dummy node.
          </li>
          <li>
            Advance <code className="code-inline">fast</code> by <strong>N</strong> steps.
            Now the gap between <code className="code-inline">slow</code> and{' '}
            <code className="code-inline">fast</code> is exactly N.
          </li>
          <li>
            Move both pointers forward one step at a time until{' '}
            <code className="code-inline">fast</code> reaches the <strong>last node</strong>.
            At this point, <code className="code-inline">slow→next</code> is the target.
          </li>
          <li>
            Set{' '}
            <code className="code-inline">slow→next = slow→next→next</code>,
            bypassing the target node.
          </li>
          <li>
            Return <code className="code-inline">dummy→next</code> as the new head.
          </li>
        </ol>

        <div className="mt-4 bg-accent/8 border border-accent/15 rounded-lg px-4 py-3">
          <p className="text-xs text-accent font-semibold mb-1">
            Why a dummy node?
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Consider a list <code className="code-inline">1 → 2 → 3</code> with N = 3.
            We need to remove the head. Without a dummy node, there is no "previous"
            node whose <code className="code-inline">next</code> pointer we can update.
            The dummy node provides exactly that — it sits before the head and lets us
            treat every deletion uniformly.
          </p>
        </div>
      </Card>

      {/* Pseudocode */}
      <Card
        icon={<Code2 size={16} />}
        title="Pseudocode"
        id="section-pseudocode"
      >
        <pre className="code-block text-[13px] leading-[1.8]">{`function removeNthFromEnd(head, n):
    dummy ← new Node(0)
    dummy.next ← head
    slow ← dummy
    fast ← dummy

    // Advance fast by n steps
    for i ← 1 to n:
        fast ← fast.next

    // Move both until fast reaches the last node
    while fast.next ≠ NULL:
        slow ← slow.next
        fast ← fast.next

    // Delete the target node
    slow.next ← slow.next.next

    return dummy.next`}</pre>
      </Card>

      {/* Complexity */}
      <Card
        icon={<Clock size={16} />}
        title="Complexity Analysis"
        id="section-complexity"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ComplexityBox
            icon={<Clock size={14} />}
            label="Time Complexity"
            value="O(n)"
            detail="We traverse the list at most once with two pointers. Each pointer moves at most n steps."
          />
          <ComplexityBox
            icon={<HardDrive size={14} />}
            label="Auxiliary Space"
            value="O(1)"
            detail="Only a constant number of extra pointers (slow, fast, dummy) are used regardless of input size."
          />
        </div>

        <div className="mt-4 bg-bg-primary border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-warning mb-1">⚠ Note on insertion cost</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            The deletion algorithm itself is O(n). However, if you build the linked list
            by inserting each node at the tail by traversing from the head every time,
            that construction is O(n²). This is separate from the deletion cost. For
            efficient tail insertion, maintain a tail pointer.
          </p>
        </div>
      </Card>

      {/* C++ Implementation */}
      <Card
        icon={<FileCode size={16} />}
        title="C++ Implementation"
        id="section-cpp"
      >
        <pre className="code-block text-[12.5px] leading-[1.75]">
{`#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// ──────────────────────────────────────────────
// Remove the Nth node from the end of the list
// Time:  O(n)   — single pass with two pointers
// Space: O(1)   — only constant extra memory
// ──────────────────────────────────────────────
ListNode* removeNthFromEnd(ListNode* head, int n) {
    // Dummy node simplifies head-deletion edge case
    ListNode* dummy = new ListNode(0);
    dummy->next = head;

    ListNode* slow = dummy;
    ListNode* fast = dummy;

    // Advance fast by n steps
    for (int i = 0; i < n; i++)
        fast = fast->next;

    // Move both until fast reaches the last node
    while (fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next;
    }

    // Delete the target node (slow->next)
    ListNode* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;

    ListNode* newHead = dummy->next;
    delete dummy;
    return newHead;
}

// ──────────────────────────────────────────────
// Helper: insert at tail using a tail pointer
// Time per insertion: O(1)
// ──────────────────────────────────────────────
void insertAtTail(ListNode*& head, ListNode*& tail, int val) {
    ListNode* node = new ListNode(val);
    if (!head) {
        head = tail = node;
    } else {
        tail->next = node;
        tail = node;
    }
}

// Print the list
void printList(ListNode* head) {
    while (head) {
        cout << head->val;
        if (head->next) cout << " -> ";
        head = head->next;
    }
    cout << " -> NULL" << endl;
}

int main() {
    ListNode* head = nullptr;
    ListNode* tail = nullptr;

    // Build list: 1 -> 2 -> 3 -> 4 -> 5
    for (int v : {1, 2, 3, 4, 5})
        insertAtTail(head, tail, v);

    cout << "Original: ";
    printList(head);

    int n = 2;
    head = removeNthFromEnd(head, n);

    cout << "After removing " << n
         << "th from end: ";
    printList(head);

    // Clean up
    while (head) {
        ListNode* tmp = head;
        head = head->next;
        delete tmp;
    }

    return 0;
}`}
        </pre>
        <p className="text-xs text-text-muted mt-2">
          Output: <code className="code-inline">1 → 2 → 3 → 5 → NULL</code>
        </p>
      </Card>

      {/* Two-Pointer Technique */}
      <Card
        icon={<Lightbulb size={16} />}
        title="The Two-Pointer Technique"
        id="section-two-pointer"
      >
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          The two-pointer (or "runner") technique is a fundamental pattern in linked list
          and array problems. Two pointers traverse the data structure at different speeds
          or with a fixed offset to solve problems in a single pass:
        </p>
        <ul className="text-sm text-text-secondary space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>Fixed-gap pointers</strong> — As in this problem. One pointer leads by
            N steps, creating a gap that lets us locate positions relative to the end.
          </li>
          <li>
            <strong>Slow/fast (tortoise & hare)</strong> — One pointer moves 1 step while
            the other moves 2 steps. Used to detect cycles (Floyd's algorithm) and find
            the middle node.
          </li>
          <li>
            <strong>Converging pointers</strong> — Two pointers start at opposite ends and
            move inward. Common in sorted array problems (e.g., two-sum).
          </li>
        </ul>
      </Card>
    </section>
  );
}

/* ─── Reusable sub-components ──────────────────────────── */

function Card({
  icon,
  title,
  id,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="bg-bg-card border border-border rounded-xl p-5"
    >
      <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </article>
  );
}

function ComplexityBox({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="bg-bg-primary border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-accent">{icon}</span>
        <span className="text-xs font-semibold text-text-secondary">{label}</span>
      </div>
      <p className="text-2xl font-bold text-accent font-mono mb-1">{value}</p>
      <p className="text-xs text-text-muted leading-relaxed">{detail}</p>
    </div>
  );
}
